from fastapi import HTTPException
from psycopg2 import IntegrityError
from sqlalchemy.orm import Session
from models.produtor import Produtor
from models.usuario import Usuario
from schemas.usuario import UsuarioCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def criar_usuario(db: Session, usuario: UsuarioCreate):
    # Verificar se já existe um usuário com o mesmo CPF
    existing_user = db.query(Usuario).filter(Usuario.cpf_cnpj == usuario.cpf_cnpj).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Usuário com este CPF já existe.")

    # Verificar se já existe um usuário com o mesmo e-mail
    existing_email = db.query(Usuario).filter(Usuario.email == usuario.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Usuário com este e-mail já existe.")

    # Hash da senha
    hashed_password = pwd_context.hash(usuario.senha)

    # Criar o usuário
    novo_usuario = Usuario(
        cpf_cnpj=usuario.cpf_cnpj,
        email=usuario.email,
        senha=hashed_password,
        nome=usuario.nome,
        e_vendedor=usuario.e_vendedor,
        telefone_1=usuario.telefone_1,
        telefone_2=usuario.telefone_2,
    )

    try:
        db.add(novo_usuario)
        db.commit()
        db.refresh(novo_usuario)

        # ✅ Só cria o produtor depois que o usuário já existe no banco
        if usuario.e_vendedor:
            novo_produtor = Produtor(
                usuario_id=novo_usuario.id,
                nome=usuario.nome,
                endereco="",
                categoria="",
                banner="",
                foto=""
            )
            db.add(novo_produtor)
            db.commit()
            db.refresh(novo_produtor)

        return novo_usuario
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Erro ao criar usuário no banco.")

def autenticar_usuario(db: Session, email: str, senha: str):
    usuario = db.query(Usuario).filter(Usuario.email == email).first()
    if not usuario:
        return None
    if not pwd_context.verify(senha, usuario.senha):
        return None
    return usuario
