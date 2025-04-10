from fastapi import FastAPI
from routes import usuario

app = FastAPI()

app.include_router(usuario.router, prefix="/api", tags=["Usuário"])