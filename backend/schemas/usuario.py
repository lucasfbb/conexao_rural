from typing import Optional
from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    email: EmailStr
    nome: str
    e_vendedor: bool = False

class UsuarioLogin(BaseModel):
    email: EmailStr
    senha: str

class UsuarioCreate(UsuarioBase):
    nome: str
    email: EmailStr
    senha: str
    cpf_cnpj: str
    e_vendedor: bool
    telefone_1: str
    telefone_2: Optional[str] = None

class UsuarioResponse(UsuarioBase):
    cpf_cnpj: str
    class Config:
        from_attributes = True
