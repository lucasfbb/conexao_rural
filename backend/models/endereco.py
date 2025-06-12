from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Endereco(Base):
    __tablename__ = 'endereco'

    id = Column(String, primary_key=True, index=True)
    cep = Column(String)
    estado = Column(String)
    cidade = Column(String)
    rua = Column(String)
    complemento = Column(String)
    cpf_usuario = Column(String, ForeignKey("usuario.cpf_cnpj"))

    usuario = relationship("Usuario", back_populates="enderecos")
    pedidos = relationship("Pedido", back_populates="endereco")
