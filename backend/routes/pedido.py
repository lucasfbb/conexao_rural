from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from auth.auth_utils import get_current_user
from models.formapagamento import FormaPagamento
from schemas.formaPagamento import PedidoPagamentoIn
from models.item_pedido import ItemPedido
import httpx
from sqlalchemy.orm import Session
from database import get_db
from models import Pedido
from models.listagem import Listagem
from models.usuario import Usuario
from models.endereco import Endereco
from schemas.pedido import PedidoCreate, PedidoItemCreate
import mercadopago

router = APIRouter()

ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU0MTgyZTZlMzcyMDQ2YTU5Y2EyNDViM2FmMjk2NjkxIiwiaCI6Im11cm11cjY0In0="

sdk = mercadopago.SDK("TEST-7194314365664629-071422-91b20e782dca6d74f6f23e20d5451c70-265020088")  

class Coordenadas(BaseModel):
    origem: list[float]  # [lon, lat]
    destino: list[float]  # [lon, lat]

@router.post("/pedidos/pagar")
def pagar_pedido(
    pagamento: PedidoPagamentoIn,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    forma = db.query(FormaPagamento).filter_by(
        id=pagamento.id_pagamento,
        usuario_id=current_user.id
    ).first()

    endereco = db.query(Endereco).filter_by(id=pagamento.id_endereco).first()
    if not forma or not endereco:
        raise HTTPException(status_code=404, detail="Dados inválidos.")

    # Agrupar itens por produtor
    pedidos_por_produtor = {}
    total_calculado = 0

    for item in pagamento.itens:
        listagem = db.query(Listagem).filter_by(id=item.id_listagem).first()
        if not listagem:
            raise HTTPException(status_code=404, detail="Listagem não encontrada.")
        
        produtor_id = listagem.produtor_id
        if produtor_id not in pedidos_por_produtor:
            pedidos_por_produtor[produtor_id] = []
        
        pedidos_por_produtor[produtor_id].append((listagem, item))
        total_calculado += float(listagem.preco) * item.quantidade

    # Opcional: Validar valor com frete
    if abs(total_calculado - pagamento.valor) > 1.0:  # margem de R$1
        raise HTTPException(status_code=400, detail="Valor divergente.")

    # Realizar pagamento com Mercado Pago
    payment_data = {
        "transaction_amount": float(pagamento.valor),
        "token": forma.token_gateway,
        "description": "Pedido no Conexão Rural",
        "installments": 1,
        "payment_method_id": forma.bandeira.lower(),
        "payer": { "email": current_user.email }
    }

    result = sdk.payment().create(payment_data)
    response = result["response"]
    status = response.get("status")

    if status != "approved":
        raise HTTPException(status_code=400, detail=f"Pagamento não aprovado: {status}")

    # Criar pedidos após pagamento aprovado
    for produtor_id, lista in pedidos_por_produtor.items():
        pedido = Pedido(
            quantidade=sum(item.quantidade for _, item in lista),
            valor=sum(float(l.preco) * i.quantidade for l, i in lista),
            status="pago",
            usuario_id=current_user.id,
            id_endereco=endereco.id,
            group_hash=pagamento.group_hash
        )
        db.add(pedido)
        db.flush()  # pega o ID do pedido

        for listagem, item in lista:
            item_pedido = ItemPedido(
                pedido_id=pedido.id,
                produto_id=listagem.produto_id,
                nome_personalizado=listagem.nome_personalizado,
                quantidade=item.quantidade,
                valor_unitario=float(listagem.preco)
            )
            db.add(item_pedido)

    db.commit()

    return {
        "status": status,
        "id_pagamento": response.get("id"),
        "valor": pagamento.valor,
        "mensagem": "Pagamento realizado e pedido criado com sucesso!"
    }

@router.post("/pedidos/pagar_pix")
def pagar_com_pix(
    pedido: PedidoPagamentoIn,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    endereco = db.query(Endereco).filter_by(id=pedido.id_endereco, usuario_id=current_user.id).first()
    if not endereco:
        raise HTTPException(404, detail="Endereço não encontrado")

    # Agrupar itens por produtor
    pedidos_por_produtor = {}
    total = 0.0

    for item in pedido.itens:
        listagem = db.query(Listagem).filter_by(id=item.id_listagem).first()
        if not listagem:
            raise HTTPException(404, detail=f"Produto com id {item.id_listagem} não encontrado")

        produtor_id = listagem.produtor_id
        if produtor_id not in pedidos_por_produtor:
            pedidos_por_produtor[produtor_id] = []

        pedidos_por_produtor[produtor_id].append((listagem, item))
        total += float(listagem.preco) * item.quantidade

    # Criar pagamento com PIX
    payment_data = {
        "transaction_amount": total,
        "description": "Pedido no Conexão Rural",
        "payment_method_id": "pix",
        "payer": {
            "email": current_user.email,
            "first_name": current_user.nome,
            "last_name": current_user.nome.split()[-1] if " " in current_user.nome else "",
            "identification": {
                "type": "CPF",
                "number": current_user.cpf_cnpj
            }
        }
    }

    result = sdk.payment().create(payment_data)
    pagamento = result["response"]
    id_pagamento = pagamento["id"]

    # Criar pedidos no banco
    for produtor_id, lista in pedidos_por_produtor.items():
        pedido_db = Pedido(
            quantidade=sum(item.quantidade for _, item in lista),
            valor=sum(float(l.preco) * i.quantidade for l, i in lista),
            status="aguardando_pagamento_pix",
            usuario_id=current_user.id,
            id_endereco=endereco.id,
            group_hash=pedido.group_hash
        )
        db.add(pedido_db)
        db.flush()  # necessário para obter pedido_db.id

        for listagem, item in lista:
            item_pedido = ItemPedido(
                pedido_id=pedido_db.id,
                produto_id=listagem.produto_id,
                nome_personalizado=listagem.nome_personalizado,
                quantidade=item.quantidade,
                valor_unitario=float(listagem.preco)
            )
            db.add(item_pedido)

    db.commit()

    return {
        "status": pagamento["status"],
        "id_pagamento": id_pagamento,
        "valor": total,
        "qr_code": pagamento["point_of_interaction"]["transaction_data"]["qr_code"],
        "qr_code_base64": pagamento["point_of_interaction"]["transaction_data"]["qr_code_base64"],
        "mensagem": "Pedido registrado. Aguardando pagamento via PIX.",
        "group_hash": pedido.group_hash
    }

@router.get("/pagamento/status/{id_pagamento}")
def consultar_status_pagamento(id_pagamento: int):
    try:
        resultado = sdk.payment().get(id_pagamento)
        status = resultado["response"].get("status")
        return {"status": status}
    except Exception as e:
        raise HTTPException(500, detail=f"Erro ao consultar status: {str(e)}")

@router.post("/frete/calcular")
async def calcular_frete(data: Coordenadas):
    url = "https://api.openrouteservice.org/v2/directions/driving-car"

    params = {
        "api_key": ORS_API_KEY,
        "start": f"{data.origem[0]},{data.origem[1]}",
        "end": f"{data.destino[0]},{data.destino[1]}"
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        route = response.json()

    distancia_m = route['features'][0]['properties']['segments'][0]['distance']
    distancia_km = distancia_m / 1000

    # Lógica de frete
    valor_frete = max(10, distancia_km * 2.5)

    return {
        "distancia_km": round(distancia_km, 2),
        "valor_frete": round(valor_frete, 2)
    }


