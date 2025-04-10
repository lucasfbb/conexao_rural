from pydantic import BaseModel, EmailStr

class UsuarioBase(BaseModel):
    email: EmailStr
    nome: str
    e_vendedor: bool = False

class UsuarioCreate(UsuarioBase):
    senha: str

class UsuarioResponse(UsuarioBase):
    cpf_cnpj: str
    class Config:
        orm_mode = True
