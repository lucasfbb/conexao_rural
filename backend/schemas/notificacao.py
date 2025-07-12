from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date, datetime


class NotificacaoBase(BaseModel):
    mensagem: str
    titulo: str
    lida: bool = False

class NotificacaoCreate(NotificacaoBase):
    usuario_cpf_cnpj: str
    tipo: Optional[str] = None
    

# class NotificacaoUpdate(BaseModel):
#     titulo: Optional[str]
#     mensagem: Optional[str]
#     tipo: Optional[str]
#     lida: Optional[bool]
#     criado_em: Optional[date]


class NotificacaoOut(NotificacaoBase):
    id: int
    usuario_cpf_cnpj: str
    lida: Optional[bool] = False
    criado_em: Optional[datetime]

    class Config:
        from_attributes = True

class NotificacaoResponse(NotificacaoBase):
    usuario_cpf_cnpj: str  # Assuming we want to include the user's name or identifier

    class Config:
        from_attributes = True
