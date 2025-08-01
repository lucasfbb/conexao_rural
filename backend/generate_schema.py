# generate_schema.py
from sqlalchemy.schema import CreateTable
from sqlalchemy import create_engine
from database import Base  # usa o mesmo Base que suas models já usam!

import models

DATABASE_URL = "postgresql://meuusuario:minhasenha@localhost:5432/meubanco"

engine = create_engine(DATABASE_URL)

# Gera o SQL de criação das tabelas
def gerar_ddl():
    print("Gerando DDL...")
    Base.metadata.create_all(bind=engine)  # Cria as tabelas se não existirem

    with open("schema.sql", "w", encoding="utf-8") as f:
        for table in Base.metadata.sorted_tables:
            ddl = str(CreateTable(table).compile(engine))
            print(f" - {table.name}")
            f.write(ddl + ";\n\n")

    print("schema.sql gerado com sucesso!")

if __name__ == "__main__":
    gerar_ddl()
