from sqlalchemy import Column, String, Integer, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from database import Base

class Listagem(Base):
    __tablename__ = 'listagem'

    id = Column(Integer, primary_key=True, autoincrement=True)
    produto_id = Column(Integer, ForeignKey('produto.id'))
    nome_personalizado = Column(String(255), nullable=True) # Nome personalizado do produto na listagem do produtor
    preco = Column(DECIMAL(10, 2))
    estoque = Column(Integer)
    produtor_id = Column(Integer, ForeignKey('produtor.id'), nullable=False)
    preco_promocional = Column(DECIMAL(10, 2))
    unidade = Column(String(50), nullable=True)
    descricao = Column(String(255), nullable=True)
    foto = Column(String(150), nullable=True)
    foto_id = Column(String(50), nullable=True)  # ID da foto no Cloudinary

    produtor = relationship("Produtor", back_populates="listagens")
    produto = relationship("Produto", back_populates="listagens")
