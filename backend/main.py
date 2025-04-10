from fastapi import FastAPI
from routes import usuario
from database import Base, engine
from models.usuario import Usuario  # e outros models

app = FastAPI()

app.include_router(usuario.router, prefix="/api", tags=["Usuário"])

Base.metadata.create_all(bind=engine)