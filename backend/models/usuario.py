from datetime import datetime
from sqlalchemy import Column, Date, DateTime, ForeignKey, String, Boolean, Table
from sqlalchemy.orm import relationship
from database import Base

# Tabela associativa entre usuários e produtos favoritos
usuarios_produtos_favoritos = Table(
    'usuarios_produtos_favoritos',
    Base.metadata,
    Column('usuario_cpf_cnpj', String, ForeignKey('usuarios.cpf_cnpj'), primary_key=True),
    Column('produto_id', String, ForeignKey('produtos.id'), primary_key=True)  # Ajuste o tipo e nome conforme seu modelo Produto
)

# Tabela associativa entre usuários e produtores favoritos
usuarios_produtores_favoritos = Table(
    'usuarios_produtores_favoritos',
    Base.metadata,
    Column('usuario_cpf_cnpj', String, ForeignKey('usuarios.cpf_cnpj'), primary_key=True),
    Column('produtor_cpf_cnpj', String, ForeignKey('produtores.cpf_cnpj'), primary_key=True)
)

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
