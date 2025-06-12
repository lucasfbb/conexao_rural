from pydantic import BaseModel
from typing import Optional

class ProdutorOut(BaseModel):
    nome: str
    endereco: Optional[str]
    distancia: Optional[float]
    categoria: Optional[str]
    foto: Optional[str]

    class Config:
        from_attributes = True

class ProdutorUpdate(BaseModel):
    nome: Optional[str] = None
    endereco: Optional[str] = None
    categoria: Optional[str] = None
    banner: Optional[str] = None
    foto: Optional[str] = None

    class Config:
        from_attributes = True