from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import date, datetime
import pytz

BRASIL_TZ = pytz.timezone("America/Sao_Paulo")

class NotificacaoBase(BaseModel):
    mensagem: str
    titulo: str
    lida: bool = False

class NotificacaoCreate(NotificacaoBase):
    # usuario_cpf_cnpj: str
    usuario_id: int
    tipo: Optional[str] = None
    

# class NotificacaoUpdate(BaseModel):
#     titulo: Optional[str]
#     mensagem: Optional[str]
#     tipo: Optional[str]
#     lida: Optional[bool]
#     criado_em: Optional[date]


class NotificacaoOut(NotificacaoBase):
    id: int
    # usuario_cpf_cnpj: str
    lida: Optional[bool] = False
    criado_em: Optional[datetime]

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda dt: dt.astimezone(BRASIL_TZ).isoformat() if dt else None
        }

class NotificacaoResponse(NotificacaoBase):
    usuario_cpf_cnpj: str  # Assuming we want to include the user's name or identifier

    class Config:
        from_attributes = True
