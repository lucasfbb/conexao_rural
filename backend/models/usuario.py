from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Usuario(Base):
    __tablename__ = 'usuarios'

    cpf_cnpj = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    senha = Column(String)
    nome = Column(String)
    e_vendedor = Column(Boolean, default=False)
    avaliacao = Column(String, nullable=True)
    foto_perfil = Column(String, nullable=True)

    enderecos = relationship("Endereco", back_populates="usuario")
    pedidos = relationship("Pedido", back_populates="usuario")
