from sqlalchemy import Table, Column, String, ForeignKey
from database import Base

usuarios_produtos_favoritos = Table(
    'usuarios_produtos_favoritos',
    Base.metadata,
    Column('usuario_cpf_cnpj', String, ForeignKey('usuarios.cpf_cnpj'), primary_key=True),
    Column('produto_id', String, ForeignKey('produtos.id'), primary_key=True)
)

usuarios_produtores_favoritos = Table(
    'usuarios_produtores_favoritos',
    Base.metadata,
    Column('usuario_cpf_cnpj', String, ForeignKey('usuarios.cpf_cnpj'), primary_key=True),
    Column('produtor_cpf_cnpj', String, ForeignKey('produtores.cpf_cnpj'), primary_key=True)
)