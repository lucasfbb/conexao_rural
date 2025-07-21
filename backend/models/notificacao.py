from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import pytz
from models.utils import agora_brasil
from database import Base

class Notificacao(Base):
    __tablename__ = "notificacao"

    id = Column(Integer, primary_key=True, autoincrement=True)
    usuario_id = Column(Integer, ForeignKey("usuario.id"), nullable=False)
    titulo = Column(String, nullable=False)
    mensagem = Column(Text, nullable=False)
    tipo = Column(String, nullable=True)
    lida = Column(Boolean, default=False)
    criado_em = Column(DateTime(timezone=True), default=agora_brasil)

    usuario = relationship("Usuario", back_populates="notificacoes")
