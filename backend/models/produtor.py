from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from models.associacoes import usuario_produtor_favorito

class Produtor(Base):
    __tablename__ = 'produtor'

    cpf_cnpj = Column(String, ForeignKey('usuario.cpf_cnpj'), primary_key=True)
    banner = Column(String, nullable=True)
    foto = Column(String, nullable=True)
    categoria = Column(String, nullable=True)
    endereco = Column(String, nullable=True)
    nome = Column(String, nullable=True)

    listagens = relationship("Listagem", back_populates="produtor")
    certificados = relationship("Certificado", back_populates="produtor")

    usuarios_favoritaram = relationship(
        "Usuario",
        secondary=usuario_produtor_favorito,
        back_populates="produtores_favoritos"
    )
