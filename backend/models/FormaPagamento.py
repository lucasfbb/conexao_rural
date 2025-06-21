from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class FormaPagamento(Base):
    __tablename__ = "forma_pagamento"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    usuario_cpf_cnpj = Column(String, ForeignKey("usuario.cpf_cnpj"), nullable=False)
    gateway = Column(String, nullable=False)  # "stripe", "mercadopago", "pagseguro"...
    token_gateway = Column(String, nullable=False)  # o token recebido do gateway
    bandeira = Column(String, nullable=True)        # Ex: "Visa", "Master"
    final_cartao = Column(String, nullable=True)    # Ex: "1234"
    nome_no_cartao = Column(String, nullable=True)  # Opcional
    criado_em = Column(DateTime, default=datetime.now)

    usuario = relationship("Usuario", backref="formas_pagamento")
