import random
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import desc
from auth.auth_utils import get_current_user
from schemas.formaPagamento import PedidoPagamentoIn
from models.item_pedido import ItemPedido
import httpx
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models import Pedido
from models.listagem import Listagem
from models.usuario import Usuario
from models.endereco import Endereco
from schemas.pedido import PedidoCreate, PedidoItemCreate
import mercadopago

router = APIRouter()

sdk = mercadopago.SDK("TEST-7194314365664629-071422-91b20e782dca6d74f6f23e20d5451c70-265020088")  

class Coordenadas(BaseModel):
    origem: list[float]  # [lon, lat]
    destino: list[float]  # [lon, lat]

@router.post("/pedidos/pagar_pix")
def pagar_com_pix(
    pedido: PedidoPagamentoIn,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    
    print('Pagar')

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
                listagem_id=listagem.id,
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

@router.post("/pedidos/novo")
async def criar_pedido_sem_pagamento(
    pedido: PedidoCreate,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):  
    print(f"Pedido recebido: {pedido}")
    endereco = db.query(Endereco).filter_by(id=pedido.id_endereco, usuario_id=current_user.id).first()
    if not endereco:
        print("Endereço não encontrado.")
        raise HTTPException(404, detail="Endereço não encontrado.")

    pedidos_por_produtor = {}

    for item in pedido.itens:
        listagem = db.query(Listagem).filter_by(id=item.id_listagem).first()
        if not listagem:
            print(f"Listagem com id {item.id_listagem} não encontrada.")
            raise HTTPException(404, detail=f"Listagem com id {item.id_listagem} não encontrada.")
        
        produtor_id = listagem.produtor_id
        if produtor_id not in pedidos_por_produtor:
            pedidos_por_produtor[produtor_id] = []
        
        pedidos_por_produtor[produtor_id].append((listagem, item))

    for produtor_id, lista in pedidos_por_produtor.items():
        pedido_db = Pedido(
            quantidade=sum(item.quantidade for _, item in lista),
            valor=pedido.valor,
            status="confirmado",  # ← Aqui está o status inicial
            usuario_id=current_user.id,
            id_endereco=endereco.id,
            group_hash=pedido.group_hash
        )
        db.add(pedido_db)
        db.flush()

        for listagem, item in lista:
            item_pedido = ItemPedido(
                pedido_id=pedido_db.id,
                produto_id=listagem.produto_id,
                nome_personalizado=listagem.nome_personalizado,
                listagem_id=listagem.id,
                quantidade=item.quantidade,
                valor_unitario=float(listagem.preco)
            )
            db.add(item_pedido)

            # ↓↓↓ Atualiza estoque
            listagem.estoque -= item.quantidade
            if listagem.estoque < 0:
                listagem.estoque = 0  # (opcional) evita número negativo
            db.add(listagem)

    db.commit()

    return {
        "mensagem": "Pedido registrado com sucesso!",
        "group_hash": pedido.group_hash
    }

@router.get("/pedidos/acompanhar/{group_hash}")
def acompanhar_pedidos(group_hash: str, db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    pedidos = (
        db.query(Pedido)
        .filter(Pedido.group_hash == group_hash, Pedido.usuario_id == current_user.id)
        .options(joinedload(Pedido.itens).joinedload(ItemPedido.listagem).joinedload(Listagem.produtor))
        .all()
    )

    if not pedidos:
        raise HTTPException(404, detail="Nenhum pedido encontrado com esse group_hash.")

    retorno = []
    for pedido in pedidos:
        nome_produtor = None

        # Obtém o nome do produtor a partir do primeiro item
        if pedido.itens and pedido.itens[0].listagem and pedido.itens[0].listagem.produtor:
            nome_produtor = pedido.itens[0].listagem.produtor.nome or "Produtor"

        retorno.append({
            "id": pedido.id,
            "usuario_id": pedido.usuario_id,
            "id_endereco": pedido.id_endereco,
            "status": pedido.status,
            "valor": pedido.valor,
            "nome_produtor": nome_produtor,
        })

    return retorno

@router.get("/pedidos/meus")
def listar_pedidos_usuario(db: Session = Depends(get_db), current_user: Usuario = Depends(get_current_user)):
    pedidos = (
        db.query(Pedido)
        .filter(Pedido.usuario_id == current_user.id)
        .order_by(desc(Pedido.id))
        .options(joinedload(Pedido.itens).joinedload(ItemPedido.listagem).joinedload(Listagem.produtor))
        .all()
    )

    if not pedidos:
        return []

    retorno = []
    for pedido in pedidos:
        nome_produtor = None
        if pedido.itens and pedido.itens[0].listagem and pedido.itens[0].listagem.produtor:
            nome_produtor = pedido.itens[0].listagem.produtor.nome or "Produtor"

        retorno.append({
            "id": pedido.id,
            "usuario_id": pedido.usuario_id,
            "id_endereco": pedido.id_endereco,
            "status": pedido.status,
            "valor": pedido.valor,
            "group_hash": pedido.group_hash,
            "nome_produtor": nome_produtor,
        })

    return retorno
