
CREATE TABLE produtos (
	id VARCHAR NOT NULL, 
	nome VARCHAR NOT NULL, 
	categoria VARCHAR, 
	descricao VARCHAR, 
	PRIMARY KEY (id)
)

;


CREATE TABLE usuarios (
	cpf_cnpj VARCHAR NOT NULL, 
	email VARCHAR, 
	senha VARCHAR, 
	nome VARCHAR, 
	e_vendedor BOOLEAN, 
	avaliacao VARCHAR, 
	foto_perfil VARCHAR, 
	telefone_1 VARCHAR, 
	telefone_2 VARCHAR, 
	data_nascimento DATE, 
	criado_em TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (cpf_cnpj)
)

;


CREATE TABLE enderecos (
	id VARCHAR NOT NULL, 
	cep VARCHAR, 
	estado VARCHAR, 
	cidade VARCHAR, 
	rua VARCHAR, 
	complemento VARCHAR, 
	cpf_usuario VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cpf_usuario) REFERENCES usuarios (cpf_cnpj)
)

;


CREATE TABLE produtores (
	cpf_cnpj VARCHAR NOT NULL, 
	banner VARCHAR, 
	foto VARCHAR, 
	categoria VARCHAR, 
	endereco VARCHAR, 
	nome VARCHAR, 
	PRIMARY KEY (cpf_cnpj), 
	FOREIGN KEY(cpf_cnpj) REFERENCES usuarios (cpf_cnpj)
)

;


CREATE TABLE usuarios_produtos_favoritos (
	usuario_cpf_cnpj VARCHAR NOT NULL, 
	produto_id VARCHAR NOT NULL, 
	PRIMARY KEY (usuario_cpf_cnpj, produto_id), 
	FOREIGN KEY(usuario_cpf_cnpj) REFERENCES usuarios (cpf_cnpj), 
	FOREIGN KEY(produto_id) REFERENCES produtos (id)
)

;


CREATE TABLE listagens (
	id VARCHAR NOT NULL, 
	produto_id VARCHAR, 
	preco INTEGER, 
	estoque INTEGER, 
	produtor_cpf VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(produto_id) REFERENCES produtos (id), 
	FOREIGN KEY(produtor_cpf) REFERENCES produtores (cpf_cnpj)
)

;


CREATE TABLE pedidos (
	id VARCHAR NOT NULL, 
	produto VARCHAR, 
	quantidade INTEGER, 
	valor INTEGER, 
	momento_compra TIMESTAMP WITHOUT TIME ZONE, 
	status VARCHAR, 
	avaliacao VARCHAR, 
	cpf_usuario VARCHAR, 
	id_endereco VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cpf_usuario) REFERENCES usuarios (cpf_cnpj), 
	FOREIGN KEY(id_endereco) REFERENCES enderecos (id)
)

;


CREATE TABLE usuarios_produtores_favoritos (
	usuario_cpf_cnpj VARCHAR NOT NULL, 
	produtor_cpf_cnpj VARCHAR NOT NULL, 
	PRIMARY KEY (usuario_cpf_cnpj, produtor_cpf_cnpj), 
	FOREIGN KEY(usuario_cpf_cnpj) REFERENCES usuarios (cpf_cnpj), 
	FOREIGN KEY(produtor_cpf_cnpj) REFERENCES produtores (cpf_cnpj)
)

;

