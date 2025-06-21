# routes/produtos.py

import os
import shutil
import uuid
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from models.Produto import Produto
from schemas.produto import ProdutoOut, ProdutoUpdate, ProdutoCreate
from database import get_db

router = APIRouter()

FOTO_PRODUTO_DIR = "uploads/fotoProduto"
os.makedirs(FOTO_PRODUTO_DIR, exist_ok=True)

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

@router.post("/produtos/{produto_id}/foto/upload")
async def upload_foto_produto(produto_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    # Gere um nome único para o arquivo
    ext = file.filename.split('.')[-1]
    nome_arquivo = f"produto_{produto_id}_{uuid.uuid4().hex}.{ext}"
    caminho = os.path.join(FOTO_PRODUTO_DIR, nome_arquivo)

    # Salve o arquivo
    with open(caminho, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Atualize o campo foto no Produto
    from models.Produto import Produto
    produto = db.query(Produto).get(produto_id)
    if not produto:
        raise HTTPException(status_code=404, detail="Produto não encontrado")

    produto.foto = f"/uploads/fotoProduto/{nome_arquivo}"
    db.commit()

    return {"foto": produto.foto}

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
    return None

@router.get("/produtos/search")
def search_produtos(q: str = "", db: Session = Depends(get_db)):
    # Busca produtos por nome, ignorando caixa/letras
    query = db.query(Produto)
    if q:
        query = query.filter(Produto.nome.ilike(f"%{q.strip()}%"))
    results = query.order_by(Produto.nome).limit(15).all()
    return [{"id": p.id, "nome": p.nome, "categoria": p.categoria} for p in results]