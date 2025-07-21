import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from main import app
from database import SessionLocal
from models.usuario import Usuario
from passlib.context import CryptContext

client = TestClient(app)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def criar_usuario_para_teste():
    db: Session = SessionLocal()
    email = "teste@example.com"
    
    usuario = db.query(Usuario).filter_by(email=email).first()
    if not usuario:
        usuario = Usuario(
            nome="Usuário Teste",
            email=email,
            senha=pwd_context.hash("1234"),
            cpf_cnpj="00011122233",
            telefone_1="21999999999",
            e_vendedor=False,
        )
        db.add(usuario)
        db.commit()
    
    db.close()

def test_login_sucesso():
    criar_usuario_para_teste()

    response = client.post("/auth/login", json={
        "email": "teste@example.com",
        "senha": "1234"
    })

    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "teste@example.com"
