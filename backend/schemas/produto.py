from pydantic import BaseModel

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
