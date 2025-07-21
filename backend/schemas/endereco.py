from pydantic import BaseModel
from typing import Optional

class EnderecoOut(BaseModel):
    id: int
    titulo: Optional[str]
    cep: str
    estado: str
    cidade: str
    rua: str
    complemento: Optional[str]
    referencia: Optional[str]

    class Config:
        from_attributes = True

class EnderecoIn(BaseModel):
    cep: str
    titulo: Optional[str] = None
    estado: str
    cidade: str
    rua: str
    complemento: Optional[str] = None
    referencia: Optional[str] = None

class EnderecoOut(EnderecoIn):
    id: int
    class Config:
        from_attributes = True

class EnderecoInput(BaseModel):
    endereco: str