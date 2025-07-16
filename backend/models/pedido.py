from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Pedido(Base):
    __tablename__ = 'pedido'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    produto = Column(String)
    quantidade = Column(Integer)
    valor = Column(Integer)
    momento_compra = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String)
    group_hash = Column(String, index=True)  # Agrupador de pedidos
    avaliacao = Column(String)

    usuario_id = Column(Integer, ForeignKey("usuario.id"))
    id_endereco = Column(Integer, ForeignKey("endereco.id"))

    usuario = relationship("Usuario", back_populates="pedidos")
    endereco = relationship("Endereco", back_populates="pedidos")

    def to_dict(self):
        return {
            "id": self.id,
            "produto": self.produto,
            "quantidade": self.quantidade,
            "valor": self.valor,
            "momento_compra": self.momento_compra.isoformat() if self.momento_compra else None,
            "status": self.status,
            "avaliacao": self.avaliacao,
            "usuario_id": self.usuario_id,
            "id_endereco": self.id_endereco,
            "usuario": {
                "id": self.usuario.id,
                "nome": self.usuario.nome
            } if self.usuario else None,
            "endereco": {
                "id": self.endereco.id,
                "rua": self.endereco.rua,
                "cidade": self.endereco.cidade
            } if self.endereco else None
        }