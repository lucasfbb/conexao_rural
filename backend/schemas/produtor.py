from pydantic import BaseModel
from typing import Optional

class ProdutorOut(BaseModel):
    cpf_cnpj: Optional[str] = None
    nome: str
    endereco: Optional[str] = None
    rua: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
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
    rua: Optional[str] = None
    numero: Optional[str] = None
    complemento: Optional[str] = None
    bairro: Optional[str] = None
    categoria: Optional[str] = None
    banner: Optional[str] = None
    foto: Optional[str] = None
    telefone_1: Optional[str] = None
    telefone_2: Optional[str] = None
    email: Optional[str] = None
    
    class Config:
        from_attributes = True