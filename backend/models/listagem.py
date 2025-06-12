from sqlalchemy import Column, String, Integer, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Listagem(Base):
    __tablename__ = 'listagem'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    produto_id = Column(Integer, ForeignKey('produto.id'))
    preco = Column(Integer)
    estoque = Column(Integer)
    produtor_cpf_cnpj = Column(String, ForeignKey('produtor.cpf_cnpj'))

    produtor = relationship("Produtor", back_populates="listagens")
    produto = relationship("Produto", back_populates="listagens")
