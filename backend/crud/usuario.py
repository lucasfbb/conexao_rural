from sqlalchemy.orm import Session
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def criar_usuario(db: Session, usuario: UsuarioCreate):
    hashed_password = pwd_context.hash(usuario.senha)
    novo_usuario = Usuario(
        cpf_cnpj=usuario.cpf_cnpj,
        email=usuario.email,
        senha=hashed_password,
        nome=usuario.nome,
        e_vendedor=usuario.e_vendedor,
        # avaliacao=usuario.avaliacao,f
        # foto_perfil=usuario.foto_perfil
    )
    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)
    return novo_usuario

def autenticar_usuario(db: Session, email: str, senha: str):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        return None
    if not pwd_context.verify(senha, usuario.senha):
        return None
    return usuario
