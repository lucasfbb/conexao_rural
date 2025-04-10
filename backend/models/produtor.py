from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Produtor(Base):
    __tablename__ = 'produtores'

    cpf_cnpj = Column(String, ForeignKey('usuarios.cpf_cnpj'), primary_key=True)
    banner = Column(String)
    categoria = Column(String)

    listagens = relationship("Listagem", back_populates="produtor")
