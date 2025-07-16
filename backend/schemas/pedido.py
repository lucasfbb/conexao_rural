from pydantic import BaseModel
from typing import List

class PedidoItemCreate(BaseModel):
    id_listagem: int
    quantidade: int

class PedidoCreate(BaseModel):
    usuario_id: int
    id_endereco: int
    id_pagamento: int  # pode ser usado depois
    group_hash: str
    itens: list[PedidoItemCreate]

    
