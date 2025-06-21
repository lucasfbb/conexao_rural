from pydantic import BaseModel
from typing import Optional

class EnderecoOut(BaseModel):
    id: int
    cep: str
    estado: str
    cidade: str
    rua: str
    complemento: Optional[str]

    class Config:
        from_attributes = True

class EnderecoIn(BaseModel):
    cep: str
    estado: str
    cidade: str
    rua: str
    complemento: Optional[str] = None

class EnderecoOut(EnderecoIn):
    id: int
    class Config:
        from_attributes = True