from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from routes import usuario
from routes import auth  # rotas de login
from routes import home
from routes import banners
from routes import produto
from database import Base, engine
import models

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(usuario.router, prefix="/usuarios", tags=["Usuário"])
app.include_router(auth.router, prefix="/auth", tags=["Autenticação"])
app.include_router(home.router, prefix="/home", tags=["Página Inicial"])
app.include_router(banners.router, tags=["Banners"])
app.include_router(produto.router, tags=["Produtos"])

Base.metadata.create_all(bind=engine)