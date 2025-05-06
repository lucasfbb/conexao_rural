from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.usuario import UsuarioCreate, UsuarioResponse
from crud.usuario import criar_usuario
from database import get_db

router = APIRouter()

@router.post("/cadastrar_user", response_model=UsuarioResponse)
def criar(usuario: UsuarioCreate, db: Session = Depends(get_db)):
    return criar_usuario(db, usuario)
