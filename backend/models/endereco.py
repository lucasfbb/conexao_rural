from sqlalchemy import Column, String, ForeignKey, Integer
from sqlalchemy.orm import relationship
from database import Base

class Endereco(Base):
    __tablename__ = 'endereco'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)

    titulo = Column(String(100), nullable=True)
    cep = Column(String(10))                      
    estado = Column(String(20))                   
    cidade = Column(String(100))
    rua = Column(String(100))
    complemento = Column(String(100))
    referencia = Column(String(100), nullable=True)

    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)

    usuario = relationship("Usuario", back_populates="enderecos")
    pedidos = relationship("Pedido", back_populates="endereco")
