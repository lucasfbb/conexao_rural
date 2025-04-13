from fastapi import FastAPI
from routes import usuario
from routes import auth  # rotas de login
from database import Base, engine
import models

app = FastAPI()

app.include_router(usuario.router, prefix="/usuarios", tags=["Usuário"])
app.include_router(auth.router, prefix="/auth", tags=["Autenticação"])

Base.metadata.create_all(bind=engine)