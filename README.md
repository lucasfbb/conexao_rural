﻿# conexao_rural

## Como executar

- Construa e inicie os serviços com o comando: ```docker compose up -d --build```

- instale as dependências com ```npm i```

- Construa e inicie a aplicação frontend com um dos seguintes comandos:

  ```npm run start```

  ```npm run android```

  ```npm run ios```

  ```npm run web```

## Uso do Alembic

✅ **Fluxo padrão do Alembic:**

1. **Detectar mudanças e gerar uma nova migração:**

  ```bash
  docker exec server-backend alembic revision --autogenerate -m "minha alteração" 
  ```

Isso cria um arquivo em alembic/versions/ com os comandos SQL equivalentes às mudanças nas models.

2. **Aplicar a migração no banco de dados:**

  ```bash
  docker exec server-backend alembic upgrade head
  ```

Isso aplica as mudanças detectadas no seu banco PostgreSQL.

3. **Reverter a última migração (opcional):**

  ```bash
  docker exec server-backend alembic downgrade -1
  ```

Esse comando desfaz a última migração aplicada.

4. **Em caso de perda de migração:**  

  Apague alembic version do banco de dados e então

  ```bash
  docker exec server-backend alembic stamp head
  ```

## Testes

Essa sequência de comandos realiza os testes já programados na pasta *tests* do sistema

  ```bash
  docker exec server-backend -it sh
  ```

  ```bash
  pytest tests/
  ```


