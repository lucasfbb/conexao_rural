from pydantic import BaseModel
from typing import Optional

class ProdutoBase(BaseModel):
    nome: str

class ProdutoCreate(ProdutoBase):
    pass

class ProdutoUpdate(BaseModel):
    sazonal: bool

class ProdutoOut(ProdutoBase):
    id: int
    sazonal: bool

    class Config:
        from_attributes = True

class ProdutoListagemOut(BaseModel):
    id: int
    nome: Optional[str] = None
    descricao: Optional[str] = None
    foto: Optional[str] = None
    preco: Optional[int] = None
    estoque: Optional[int] = None

    class Config:
        from_attributes = True
