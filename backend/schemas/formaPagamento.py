from pydantic import BaseModel
from typing import Optional

class FormaPagamentoIn(BaseModel):
    gateway: str                   # Ex: "stripe", "mercadopago"
    token_gateway: str             # Token retornado pelo gateway após registro seguro do cartão
    bandeira: Optional[str] = None # Ex: "Visa", "Mastercard"
    final_cartao: Optional[str] = None # Ex: "1234"
    nome_impresso: Optional[str] = None # Opcional, para exibição
    nome_cartao: Optional[str] = None # Opcional, para exibição

class FormaPagamentoOut(FormaPagamentoIn):
    id: int
    usuario_cpf_cnpj: str

    class Config:
        from_attributes = True