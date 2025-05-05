from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Listagem(Base):
    __tablename__ = 'listagens'

    id = Column(String, primary_key=True, index=True)
    produto_id = Column(String, ForeignKey('produtos.id'))
    preco = Column(Integer)
    estoque = Column(Integer)
    produtor_cpf = Column(String, ForeignKey('produtores.cpf_cnpj'))

    produtor = relationship("Produtor", back_populates="listagens")
    produto = relationship("Produto", back_populates="listagens")