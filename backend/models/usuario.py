from datetime import datetime
from sqlalchemy import Column, Date, DateTime, Integer, String, Boolean
from sqlalchemy.orm import relationship
from models.utils import agora_brasil
from database import Base
from models.associacoes import usuario_produto_favorito, usuario_produtor_favorito

class Usuario(Base):
    __tablename__ = 'usuario'

    id = Column(Integer, primary_key=True, autoincrement=True)
    cpf_cnpj = Column(String(20), unique=True, index=True)  # CPF: 11, CNPJ: 14 + margem
    email = Column(String(120), unique=True, index=True)    # emails longos e seguros
    senha = Column(String(128))                             # hash de senha (ex: bcrypt)
    nome = Column(String(100))
    e_vendedor = Column(Boolean, default=False)
    avaliacao = Column(String(5), nullable=True)            # ex: "4.5"
    foto_perfil = Column(String(255), nullable=True)        # URL pode ser longa
    foto_id = Column(String(100), nullable=True)            # ID interno do Cloudinary
    telefone_1 = Column(String(20), nullable=True)          # inclui DDD + número
    telefone_2 = Column(String(20), nullable=True)
    # data_nascimento = Column(Date, nullable=True)
    criado_em = Column(DateTime, default=agora_brasil)

    # # Campos para recuperação de senha
    token_recuperacao = Column(String(100), nullable=True)  # pode usar UUID/token seguro
    token_expira_em = Column(DateTime, nullable=True)

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
