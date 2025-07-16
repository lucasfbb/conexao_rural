from pydantic import BaseModel
from typing import List

class PedidoItemCreate(BaseModel):
    id_listagem: int
    quantidade: int

class PedidoCreate(BaseModel):
    # cpf_usuario: str
    usuario_id: int
    id_endereco: int
    id_pagamento: int
    itens: List[PedidoItemCreate]

    
