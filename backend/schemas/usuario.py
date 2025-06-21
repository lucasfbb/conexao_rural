from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date, datetime

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

class UsuarioOut(UsuarioBase):
    cpf_cnpj: str
    foto_perfil: Optional[str]
    data_nascimento: Optional[date]
    criado_em: Optional[datetime]
    class Config:
        from_attributes = True

class UsuarioUpdate(BaseModel):
    email: Optional[EmailStr]
    nome: Optional[str]
    categoria: Optional[str]
    telefone_1: Optional[str]
    telefone_2: Optional[str]
    foto_perfil: Optional[str]
    data_nascimento: Optional[date]

class UsuarioResponse(UsuarioBase):
    cpf_cnpj: str
    class Config:
        from_attributes = True
