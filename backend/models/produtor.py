from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from models.usuario import usuarios_produtores_favoritos

class Produtor(Base):
    __tablename__ = 'produtores'

    cpf_cnpj = Column(String, ForeignKey('usuarios.cpf_cnpj'), primary_key=True)
    banner = Column(String)
    foto = Column(String)
    categoria = Column(String)
    endereco = Column(String)
    nome = Column(String)

    listagens = relationship("Listagem", back_populates="produtor")

    usuarios_favoritaram = relationship(
        "Usuario",
        secondary=usuarios_produtores_favoritos,
        back_populates="produtores_favoritos"
    )