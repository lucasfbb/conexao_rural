from database import Base, engine
import models

print("Criando tabelas...")
Base.metadata.create_all(bind=engine)
print("Tabelas criadas.")