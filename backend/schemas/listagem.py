from pydantic import BaseModel
from typing import Optional

class ListagemCreate(BaseModel):
    nome: str
    preco: float
    preco_promocional: Optional[float] = None
    quantidade: float
    unidade: str
    # imagem_url: Optional[str] = None