from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import httpx
from sqlalchemy.orm import Session
from database import get_db
from models import Pedido
from models.listagem import Listagem
from models.usuario import Usuario
from models.endereco import Endereco
from schemas.pedido import PedidoCreate, PedidoItemCreate

router = APIRouter()

ORS_API_KEY = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImU0MTgyZTZlMzcyMDQ2YTU5Y2EyNDViM2FmMjk2NjkxIiwiaCI6Im11cm11cjY0In0="

class Coordenadas(BaseModel):
    origem: list[float]  # [lon, lat]
    destino: list[float]  # [lon, lat]

@router.post("/pedidos/")
def criar_pedido(payload: PedidoCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(id=payload.usuario_id).first()
    endereco = db.query(Endereco).filter_by(id=payload.id_endereco).first()

    if not usuario or not endereco:
        raise HTTPException(status_code=404, detail="Usuário ou endereço não encontrado.")

    # Agrupar itens por produtor
    pedidos_por_produtor = {}

    for item in payload.itens:
        listagem = db.query(Listagem).filter_by(id=item.id_listagem).first()
        if not listagem:
            raise HTTPException(status_code=404, detail=f"Produto com ID {item.id_listagem} não encontrado.")

        produtor_id = listagem.produtor_id

        if produtor_id not in pedidos_por_produtor:
            pedidos_por_produtor[produtor_id] = []

        pedidos_por_produtor[produtor_id].append((listagem, item))

    # Criar um pedido para cada produtor
    for produtor_id, lista in pedidos_por_produtor.items():
        for listagem, item in lista:
            pedido = Pedido(
                produto=listagem.nome_personalizado or listagem.produto.nome,
                quantidade=item.quantidade,
                valor=float(listagem.preco) * item.quantidade,
                status="pendente",
                usuario_id=usuario.id,
                id_endereco=endereco.id,
                group_hash=payload.group_hash
            )
            db.add(pedido)

    db.commit()
    return {"mensagem": "Pedidos criados com sucesso", "group_hash": payload.group_hash}

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


