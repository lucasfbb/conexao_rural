from sqlalchemy import Column, String, Boolean, Integer
from sqlalchemy.orm import relationship
from database import Base
from models.associacoes import usuario_produto_favorito

class Produto(Base):
    __tablename__ = 'produto'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String, nullable=False)
    categoria = Column(String, nullable=True)
    sazonal = Column(Boolean, default=False)

    listagens = relationship("Listagem", back_populates="produto")

    usuarios_favoritaram = relationship(
        "Usuario",
        secondary=usuario_produto_favorito,
        back_populates="produtos_favoritos"
    )
