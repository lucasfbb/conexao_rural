from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from database import Base
from models.usuario import usuarios_produtos_favoritos

class Produto(Base):
    __tablename__ = 'produtos'

    id = Column(String, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    categoria = Column(String, nullable=True)  # Exemplo de campo, adicione mais se quiser
    descricao = Column(String)

    listagens = relationship("Listagem", back_populates="produto")

    usuarios_favoritaram = relationship(
        "Usuario",
        secondary=usuarios_produtos_favoritos,
        back_populates="produtos_favoritos"
    )
