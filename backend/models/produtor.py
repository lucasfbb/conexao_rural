from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from models.associacoes import usuario_produtor_favorito

class Produtor(Base):
    __tablename__ = 'produtor'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey('usuario.id'), nullable=False, unique=True)
    
    banner = Column(String(255), nullable=True)
    banner_id = Column(String(100), nullable=True)
    foto = Column(String(255), nullable=True)
    foto_id = Column(String(100), nullable=True)
    
    categoria = Column(String(50), nullable=True)
    endereco = Column(String(100), nullable=True)
    rua = Column(String(100), nullable=True)
    numero = Column(String(10), nullable=True)
    complemento = Column(String(100), nullable=True)
    bairro = Column(String(100), nullable=True)
    nome = Column(String(100), nullable=True)

    usuario = relationship("Usuario", back_populates="produtor")
    listagens = relationship("Listagem", back_populates="produtor")
    certificados = relationship("Certificado", back_populates="produtor")

    usuarios_favoritaram = relationship(
        "Usuario",
        secondary=usuario_produtor_favorito,
        back_populates="produtores_favoritos"
    )
