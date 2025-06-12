# routes/produtos.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.produto import Produto
from schemas.produto import ProdutoOut, ProdutoUpdate, ProdutoCreate
from database import get_db

router = APIRouter()

@router.get("/produtos", response_model=list[ProdutoOut])
def listar_produtos(db: Session = Depends(get_db)):
    return db.query(Produto).all()

@router.patch("/produtos/{produto_id}", response_model=ProdutoOut)
def atualizar_sazonal(produto_id: int, update: ProdutoUpdate, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    produto.sazonal = update.sazonal
    db.commit()
    db.refresh(produto)
    return produto

@router.post("/produtos", response_model=ProdutoOut)
def criar_produto(produto: ProdutoCreate, db: Session = Depends(get_db)):
    novo_produto = Produto(nome=produto.nome)
    db.add(novo_produto)
    db.commit()
    db.refresh(novo_produto)
    return novo_produto

@router.delete("/produtos/{produto_id}", status_code=204)
def deletar_produto(produto_id: int, db: Session = Depends(get_db)):
    produto = db.query(Produto).filter(Produto.id == produto_id).first()
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    db.delete(produto)
    db.commit()
    return None  # Ou apenas "pass"