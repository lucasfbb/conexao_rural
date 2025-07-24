from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from models.associacoes import usuario_produtor_favorito

class Produtor(Base):
    __tablename__ = 'produtor'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False, unique=True)
    banner = Column(String, nullable=True)
    banner_id = Column(String, nullable=True)  # ID do banner no Cloudinary
    foto = Column(String, nullable=True)
    foto_id = Column(String, nullable=True)  # ID da foto no Cloudinary
    categoria = Column(String, nullable=True)
    endereco = Column(String, nullable=True)
    rua = Column(String, nullable=True)
    numero = Column(String, nullable=True)
    complemento = Column(String, nullable=True)
    bairro = Column(String, nullable=True)
    # cidade = Column(String, nullable=True)
    nome = Column(String, nullable=True)

    usuario = relationship("Usuario", back_populates="produtor")
    listagens = relationship("Listagem", back_populates="produtor")
    certificados = relationship("Certificado", back_populates="produtor")

    usuarios_favoritaram = relationship(
        "Usuario",
        secondary=usuario_produtor_favorito,
        back_populates="produtores_favoritos"
    )
