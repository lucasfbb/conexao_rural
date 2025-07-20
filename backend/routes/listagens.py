import os
import time
from typing import Optional
from auth.auth_utils import get_current_user
from models.endereco import Endereco
from models.item_pedido import ItemPedido
from models.pedido import Pedido
from schemas.pedido import PedidoCreate
from schemas.listagem import ListagemCreate
from schemas.produto import ProdutoEstoqueOut, ProdutoOut
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
import shutil
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from models.produto import Produto
from models.produtor import Produtor
from models.listagem import Listagem

router = APIRouter()


@router.get("/listagens/{nome}", response_model=list[ProdutoEstoqueOut])
def listar_produtos_produtor(nome: str, db: Session = Depends(get_db)):
    produtos = db.query(Produto).filter(Produto.nome.ilike(f"%{nome}%")).all()
    produto_ids = [p.id for p in produtos]
    listagens = db.query(Listagem).filter(Listagem.produto_id.in_(produto_ids)).all()

    produtos = []
    for listagem in listagens:
        produto = listagem.produto
        produtor = db.query(Produtor).filter(Produtor.id == listagem.produtor_id).first()
        produtos.append({
            "id": produto.id,
            "listagem_id": listagem.id,
            "nome": produto.nome,
            "nome_personalizado": listagem.nome_personalizado if listagem.nome_personalizado else produto.nome,
            "preco": float(listagem.preco),
            "estoque": listagem.estoque,
            "unidade": listagem.unidade,
            "descricao": listagem.descricao,
            "preco_promocional": float(listagem.preco_promocional) if listagem.preco_promocional else None,
            "foto": listagem.foto if hasattr(listagem, "foto") else produto.foto if hasattr(produto, "foto") else None,
            "vendedor": produtor.nome,
        })
    
    return produtos
