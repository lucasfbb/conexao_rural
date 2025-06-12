from sqlalchemy import Table, Column, String, ForeignKey, Integer
from database import Base

usuario_produto_favorito = Table(
    'usuario_produto_favorito',
    Base.metadata,
    Column('usuario_cpf_cnpj', String, ForeignKey('usuario.cpf_cnpj'), primary_key=True),
    Column('produto_id', Integer, ForeignKey('produto.id'), primary_key=True)
)

usuario_produtor_favorito = Table(
    'usuario_produtor_favorito',
    Base.metadata,
    Column('usuario_cpf_cnpj', String, ForeignKey('usuario.cpf_cnpj'), primary_key=True),
    Column('produtor_cpf_cnpj', String, ForeignKey('produtor.cpf_cnpj'), primary_key=True)
)
