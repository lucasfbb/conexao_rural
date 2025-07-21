from datetime import datetime
from sqlalchemy import Column, Date, DateTime, Integer, String, Boolean
from sqlalchemy.orm import relationship
from models.utils import agora_brasil
from database import Base
from models.associacoes import usuario_produto_favorito, usuario_produtor_favorito

class Usuario(Base):
    __tablename__ = 'usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpf_cnpj = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    senha = Column(String)
    nome = Column(String)
    e_vendedor = Column(Boolean, default=False)
    avaliacao = Column(String, nullable=True)
    foto_perfil = Column(String, nullable=True)
    telefone_1 = Column(String, nullable=True)
    telefone_2 = Column(String, nullable=True)
    data_nascimento = Column(Date, nullable=True)
    criado_em = Column(DateTime, default=agora_brasil)

    produtor = relationship("Produtor", back_populates="usuario", uselist=False)

    enderecos = relationship("Endereco", back_populates="usuario")
    pedidos = relationship("Pedido", back_populates="usuario")
    notificacoes = relationship("Notificacao", back_populates="usuario")

    produtos_favoritos = relationship(
        "Produto",
        secondary=usuario_produto_favorito,
        back_populates="usuarios_favoritaram"
    )

    produtores_favoritos = relationship(
        "Produtor",
        secondary=usuario_produtor_favorito,
        back_populates="usuarios_favoritaram"
    )
