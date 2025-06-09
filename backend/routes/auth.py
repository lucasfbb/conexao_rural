from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas.usuario import UsuarioLogin
from crud.usuario import autenticar_usuario
from auth.jwt import criar_token

router = APIRouter()

@router.post("/login")
def login(usuario: UsuarioLogin, db: Session = Depends(get_db)):
    usuario_autenticado = autenticar_usuario(db, usuario.email, usuario.senha)
    if not usuario_autenticado:
        raise HTTPException(status_code=401, detail="Credenciais inválidas")
    
    token = criar_token({"sub": usuario_autenticado.email})
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "cpf_cnpj": usuario_autenticado.cpf_cnpj,
            "email": usuario_autenticado.email,
            "nome": usuario_autenticado.nome,
            "e_vendedor": usuario_autenticado.e_vendedor,
            "avaliacao": usuario_autenticado.avaliacao,
            "foto_perfil": usuario_autenticado.foto_perfil,
            "telefone_1": usuario_autenticado.telefone_1,
            "telefone_2": usuario_autenticado.telefone_2,
            "data_nascimento": str(usuario_autenticado.data_nascimento) if usuario_autenticado.data_nascimento else None,
            "criado_em": str(usuario_autenticado.criado_em) if usuario_autenticado.criado_em else None
        }
    }
