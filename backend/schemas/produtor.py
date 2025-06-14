from pydantic import BaseModel
from typing import Optional

class ProdutorOut(BaseModel):
    nome: str
    endereco: Optional[str] = None
    distancia: Optional[float] = None
    categoria: Optional[str] = None
    foto: Optional[str] = None
    banner: Optional[str] = None
    email: Optional[str] = None
    telefone_1: Optional[str] = None
    telefone_2: Optional[str] = None

    class Config:
        from_attributes = True


class ProdutorUpdate(BaseModel):
    nome: Optional[str] = None
    endereco: Optional[str] = None
    categoria: Optional[str] = None
    banner: Optional[str] = None
    foto: Optional[str] = None
    telefone_1: Optional[str] = None
    telefone_2: Optional[str] = None
    email: Optional[str] = None
    
    class Config:
        from_attributes = True