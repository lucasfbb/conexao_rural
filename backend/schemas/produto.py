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

class ProdutoEstoqueOut(BaseModel):
    id: int
    listagem_id: int
    nome: str
    nome_personalizado: Optional[str] = None
    preco: float
    estoque: int
    unidade: Optional[str]
    descricao: Optional[str] = None
    preco_promocional: Optional[float] = None
    foto: Optional[str] = None  # ou imagem, como preferir

    class Config:
        from_attributes = True