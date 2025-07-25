from pydantic import BaseModel
from typing import Optional

class ProdutorOut(BaseModel):
    id: Optional[int] = None
    usuario_id: Optional[int] = None
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
    foto_id: Optional[str] = None  # ID da foto no Cloudinary
    banner: Optional[str] = None
    banner_id: Optional[str] = None  # ID do banner no Cloudinary
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