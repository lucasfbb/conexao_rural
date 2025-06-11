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
