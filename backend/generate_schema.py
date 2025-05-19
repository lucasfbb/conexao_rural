# generate_schema.py
from sqlalchemy.schema import CreateTable
from models.produtor import Produtor
from models.produto import Produto
from models.pedido import Pedido
from models.usuario import Usuario
from models.endereco import Endereco
from models.listagem import Listagem
from models.associacoes import usuarios_produtos_favoritos, usuarios_produtores_favoritos
from database import engine, Base

# Gera o SQL de criação das tabelas
def gerar_ddl():
    Base.metadata.create_all(bind=engine)  # Cria as tabelas se não existirem

    with open("schema.sql", "w", encoding="utf-8") as f:
        for table in Base.metadata.sorted_tables:
            f.write(str(CreateTable(table).compile(engine)) + ";\n\n")

if __name__ == "__main__":
    gerar_ddl()
