from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Endereco(Base):
    __tablename__ = 'enderecos'

    id = Column(String, primary_key=True, index=True)
    cep = Column(String)
    estado = Column(String)
    cidade = Column(String)
    rua = Column(String)
    complemento = Column(String)
    cpf_usuario = Column(String, ForeignKey("usuarios.cpf_cnpj"))

    usuario = relationship("Usuario", back_populates="enderecos")
