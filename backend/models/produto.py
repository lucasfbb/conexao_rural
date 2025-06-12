from sqlalchemy import Column, String, Boolean
from sqlalchemy.orm import relationship
from database import Base
from models.associacoes import usuario_produto_favorito

class Produto(Base):
    __tablename__ = 'produto'

    id = Column(String, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    categoria = Column(String, nullable=True)
    descricao = Column(String)
    sazonal = Column(Boolean, default=False)

    listagens = relationship("Listagem", back_populates="produto")

    usuarios_favoritaram = relationship(
        "Usuario",
        secondary=usuario_produto_favorito,
        back_populates="produtos_favoritos"
    )
