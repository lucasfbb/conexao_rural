from pydantic import BaseModel
from typing import List, Optional

class PedidoItemCreate(BaseModel):
    id_listagem: int
    quantidade: int

class PedidoCreate(BaseModel):
    usuario_id: Optional[int] = None
    id_endereco: int
    id_pagamento: Optional[int] = None
    group_hash: str
    itens: list[PedidoItemCreate]

    
