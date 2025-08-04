from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime
from sqlalchemy.orm import relationship
from models.utils import agora_brasil
from database import Base

class Certificado(Base):
    __tablename__ = "certificado"

    id = Column(Integer, primary_key=True, autoincrement=True)
    produtor_id = Column(Integer, ForeignKey("produtor.id"), nullable=False)

    nome = Column(String(100), nullable=False)
    instituicao = Column(String(100), nullable=True)
    validade = Column(Date, nullable=True)
    arquivo = Column(String(255), nullable=True)
    criado_em = Column(DateTime, default=agora_brasil)

    produtor = relationship("Produtor", back_populates="certificados")
