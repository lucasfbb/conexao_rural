from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class ItemPedido(Base):
    __tablename__ = "item_pedido"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedido.id"))
    produto_id = Column(Integer, ForeignKey("produto.id"))
    nome_personalizado_comprado = Column(String(255), nullable=True)
    quantidade = Column(Integer)
    valor_unitario_comprado = Column(Integer)
    listagem_id = Column(Integer, ForeignKey("listagem.id"))

    listagem = relationship("Listagem")
    pedido = relationship("Pedido", back_populates="itens")
    produto = relationship("Produto")

    def to_dict(self):
        return {
            "id": self.id,
            "pedido_id": self.pedido_id,
            "produto_id": self.produto_id,
            "nome_personalizado": self.nome_personalizado,
            "quantidade": self.quantidade,
            "valor_unitario": self.valor_unitario,
            "listagem_id": self.listagem_id,
            "produto": self.produto.to_dict() if hasattr(self.produto, "to_dict") else None,
            "listagem": self.listagem.to_dict() if hasattr(self.listagem, "to_dict") else None,
        }
