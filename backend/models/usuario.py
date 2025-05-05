from datetime import datetime
from sqlalchemy import Column, Date, DateTime, ForeignKey, String, Boolean, Table
from sqlalchemy.orm import relationship
from database import Base
from models.associacoes import usuarios_produtos_favoritos, usuarios_produtores_favoritos

class Usuario(Base):
    __tablename__ = 'usuarios'

    cpf_cnpj = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    senha = Column(String)
    nome = Column(String)
    e_vendedor = Column(Boolean, default=False)
    avaliacao = Column(String, nullable=True)
    foto_perfil = Column(String, nullable=True)
    telefone_1 = Column(String, nullable=True)
    telefone_2 = Column(String, nullable=True)
    data_nascimento = Column(Date, nullable=True)
    criado_em = Column(DateTime, default=datetime.now())

    enderecos = relationship("Endereco", back_populates="usuario")
    pedidos = relationship("Pedido", back_populates="usuario")

    # Produtos favoritos (relação muitos-para-muitos)
    produtos_favoritos = relationship(
        "Produto",
        secondary=usuarios_produtos_favoritos,
        back_populates="usuarios_favoritaram"
    )

    # Produtores favoritos (relação muitos-para-muitos)
    produtores_favoritos = relationship(
        "Produtor",
        secondary=usuarios_produtores_favoritos,
        back_populates="usuarios_favoritaram"
    )
