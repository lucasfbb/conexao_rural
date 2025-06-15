from sqlalchemy.orm import Session
from database import SessionLocal
from models.usuario import Usuario
from passlib.hash import bcrypt
from sqlalchemy.exc import IntegrityError

def criar_admin():
    db: Session = SessionLocal()
    admin = db.query(Usuario).filter(Usuario.email == "admin@admin.com").first()
    if not admin:
        try:
            novo_admin = Usuario(
                nome="Administrador",
                email="admin@admin.com",
                senha=bcrypt.hash("12"),
                cpf_cnpj="00000000000"
            )
            db.add(novo_admin)
            db.commit()
            print("Usuário admin criado!")
        except IntegrityError:
            db.rollback()
            print("Usuário admin já existe, ignorando.")
    else:
        print("Usuário admin já existe.")
    db.close()

if __name__ == "__main__":
    criar_admin()
