from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class ItemPedido(Base):
    __tablename__ = "item_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedido.id"))
    produto_id = Column(Integer, ForeignKey("produto.id"))
    nome_personalizado = Column(String)
    quantidade = Column(Integer)
    valor_unitario = Column(Integer)

    pedido = relationship("Pedido", back_populates="itens")
    produto = relationship("Produto")
