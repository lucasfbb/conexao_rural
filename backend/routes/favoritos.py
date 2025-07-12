from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.usuario import Usuario
from models.produtor import Produtor

router = APIRouter()

@router.get("/favoritos/produtor")
def listar_favoritos_produtores(cpf_usuario: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(cpf_cnpj=cpf_usuario).first()
    if not usuario:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return [p.cpf_cnpj for p in usuario.produtores_favoritos]

@router.post("/favoritos/produtor")
def adicionar_favorito_produtor(cpf_usuario: str, cpf_produtor: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(cpf_cnpj=cpf_usuario).first()
    produtor = db.query(Produtor).filter_by(cpf_cnpj=cpf_produtor).first()

    if not usuario or not produtor:
        raise HTTPException(status_code=404, detail="Usuário ou produtor não encontrado")

    if produtor in usuario.produtores_favoritos:
        raise HTTPException(status_code=400, detail="Produtor já favoritado")

    usuario.produtores_favoritos.append(produtor)
    db.commit()
    return {"msg": "Produtor favoritado com sucesso"}

@router.delete("/favoritos/produtor")
def remover_favorito_produtor(cpf_usuario: str, cpf_produtor: str, db: Session = Depends(get_db)):
    usuario = db.query(Usuario).filter_by(cpf_cnpj=cpf_usuario).first()
    produtor = db.query(Produtor).filter_by(cpf_cnpj=cpf_produtor).first()

    if not usuario or not produtor:
        raise HTTPException(status_code=404, detail="Usuário ou produtor não encontrado")

    if produtor in usuario.produtores_favoritos:
        usuario.produtores_favoritos.remove(produtor)
        db.commit()

    return {"msg": "Produtor removido dos favoritos"}
