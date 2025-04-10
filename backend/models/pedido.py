from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Pedido(Base):
    __tablename__ = 'pedidos'

    id = Column(String, primary_key=True, index=True)
    produto = Column(String)
    quantidade = Column(Integer)
    valor = Column(Integer)
    momento_compra = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String)
    avaliacao = Column(String)

    cpf_usuario = Column(String, ForeignKey("usuarios.cpf_cnpj"))
    id_endereco = Column(String, ForeignKey("enderecos.id"))

    usuario = relationship("Usuario", back_populates="pedidos")
    endereco = relationship("Endereco")
