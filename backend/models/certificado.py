from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class Certificado(Base):
    __tablename__ = "certificado"

    id = Column(Integer, primary_key=True, autoincrement=True)
    produtor_cpf_cnpj = Column(String, ForeignKey("produtor.cpf_cnpj"), nullable=False)
    nome = Column(String, nullable=False)
    instituicao = Column(String, nullable=True)
    validade = Column(Date, nullable=True)
    arquivo = Column(String, nullable=True)
    criado_em = Column(DateTime, default=datetime.now)

    produtor = relationship("Produtor", back_populates="certificados")
