from pydantic import BaseModel
from typing import List

class PedidoItemCreate(BaseModel):
    id_listagem: int
    quantidade: int

class PedidoCreate(BaseModel):
    cpf_usuario: str
    id_endereco: int
    itens: List[PedidoItemCreate]

    
