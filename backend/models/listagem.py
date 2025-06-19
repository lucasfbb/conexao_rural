from sqlalchemy import Column, String, Integer, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from database import Base

class Listagem(Base):
    __tablename__ = 'listagem'

    id = Column(Integer, primary_key=True, autoincrement=True)
    produto_id = Column(Integer, ForeignKey('produto.id'))
    preco = Column(DECIMAL(10, 2))
    estoque = Column(Integer)
    produtor_cpf_cnpj = Column(String, ForeignKey('produtor.cpf_cnpj'))
    preco_promocional = Column(DECIMAL(10, 2))
    unidade = Column(String(50), nullable=True)
    foto = Column(String(100), nullable=True)

    produtor = relationship("Produtor", back_populates="listagens")
    produto = relationship("Produto", back_populates="listagens")
