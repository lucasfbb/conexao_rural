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
    id: Optional[int] = None
    nome: str
    email: EmailStr
    senha: str
    cpf_cnpj: str
    e_vendedor: bool
    telefone_1: str
    telefone_2: Optional[str] = None

class UsuarioOut(UsuarioBase):
    id: int
    nome: str
    email: EmailStr
    telefone_1: Optional[str] = None
    telefone_2: Optional[str] = None
    cpf_cnpj: str
    e_vendedor: Optional[bool] = None
    foto_perfil: Optional[str] = None
    data_nascimento: Optional[date] = None
    criado_em: Optional[datetime] = None
    class Config:
        from_attributes = True

class UsuarioUpdate(BaseModel):
    email: Optional[EmailStr] = None
    nome: Optional[str] = None
    # categoria: Optional[str]
    telefone_1: Optional[str] = None
    telefone_2: Optional[str] = None
    foto_perfil: Optional[str] = None
    data_nascimento: Optional[date] = None

class UsuarioResponse(UsuarioBase):
    id: int
    cpf_cnpj: str
    class Config:
        from_attributes = True
