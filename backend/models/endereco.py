from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from database import Base

class Endereco(Base):
    __tablename__ = 'endereco'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    titulo = Column(String, nullable=True)
    cep = Column(String)
    estado = Column(String)
    cidade = Column(String)
    rua = Column(String)
    complemento = Column(String)
    referencia = Column(String, nullable=True)
    
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)

    usuario = relationship("Usuario", back_populates="enderecos")
    pedidos = relationship("Pedido", back_populates="endereco")
