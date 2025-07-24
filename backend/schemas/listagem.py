from pydantic import BaseModel
from typing import Optional

class ListagemCreate(BaseModel):
    nome: str
    preco: float
    preco_promocional: Optional[float] = None
    quantidade: float
    unidade: str
    foto: Optional[str] = None  # URL da foto
    foto_id: Optional[str] = None  # ID da foto no Cloudinary
    descricao: Optional[str] = None
    # imagem_url: Optional[str] = None