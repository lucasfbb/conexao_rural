from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from models.utils import agora_brasil
from database import Base

class Pagamento(Base):
    __tablename__ = "pagamento"

    id = Column(Integer, primary_key=True, index=True)
    pedido_id = Column(Integer, ForeignKey("pedido.id"), nullable=False)

    metodo = Column(String(30), default="mercadopago")  # Ex: mercadopago, pix, cartão
    status = Column(String(20), default="pendente")      # pendente, aprovado, cancelado, etc.
    mp_preference_id = Column(String(100), nullable=True)
    mp_payment_id = Column(String(100), nullable=True)

    criado_em = Column(DateTime, default=agora_brasil)

    pedido = relationship("Pedido", back_populates="pagamento")
