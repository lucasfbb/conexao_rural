from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Pedido
from models.listagem import Listagem
from models.usuario import Usuario
from models.endereco import Endereco
from schemas.pedido import PedidoCreate, PedidoItemCreate

router = APIRouter()

@router.post("/pedidos/")
def criar_pedido(payload: PedidoCreate, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(cpf_cnpj=payload.cpf_usuario).first()
    endereco = db.query(Endereco).filter_by(id=payload.id_endereco).first()

    if not usuario or not endereco:
        raise HTTPException(status_code=404, detail="Usuário ou endereço não encontrado.")

    for item in payload.itens:
        listagem = db.query(Listagem).filter_by(id=item.id_listagem).first()
        if not listagem:
            raise HTTPException(status_code=404, detail=f"Produto com ID {item.id_listagem} não encontrado.")

        pedido = Pedido(
            produto=listagem.nome_personalizado or listagem.produto.nome,
            quantidade=item.quantidade,
            valor=float(listagem.preco) * item.quantidade,
            status="pendente",
            cpf_usuario=usuario.cpf_cnpj,
            id_endereco=endereco.id
        )
        db.add(pedido)

    db.commit()
    return {"mensagem": "Pedido realizado com sucesso."}
