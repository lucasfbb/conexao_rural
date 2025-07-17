
CREATE TABLE produto (
	id SERIAL NOT NULL, 
	nome VARCHAR NOT NULL, 
	categoria VARCHAR, 
	sazonal BOOLEAN, 
	PRIMARY KEY (id)
)

;


CREATE TABLE usuario (
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


CREATE TABLE endereco (
	id SERIAL NOT NULL, 
	cep VARCHAR, 
	estado VARCHAR, 
	cidade VARCHAR, 
	rua VARCHAR, 
	complemento VARCHAR, 
	cpf_usuario VARCHAR, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cpf_usuario) REFERENCES usuario (cpf_cnpj)
)

;


CREATE TABLE forma_pagamento (
	id SERIAL NOT NULL, 
	usuario_cpf_cnpj VARCHAR NOT NULL, 
	gateway VARCHAR NOT NULL, 
	token_gateway VARCHAR NOT NULL, 
	bandeira VARCHAR, 
	final_cartao VARCHAR, 
	nome_no_cartao VARCHAR, 
	criado_em TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(usuario_cpf_cnpj) REFERENCES usuario (cpf_cnpj)
)

;


CREATE TABLE produtor (
	cpf_cnpj VARCHAR NOT NULL, 
	banner VARCHAR, 
	foto VARCHAR, 
	categoria VARCHAR, 
	endereco VARCHAR, 
	nome VARCHAR, 
	PRIMARY KEY (cpf_cnpj), 
	FOREIGN KEY(cpf_cnpj) REFERENCES usuario (cpf_cnpj)
)

;


CREATE TABLE usuario_produto_favorito (
	usuario_cpf_cnpj VARCHAR NOT NULL, 
	produto_id INTEGER NOT NULL, 
	PRIMARY KEY (usuario_cpf_cnpj, produto_id), 
	FOREIGN KEY(usuario_cpf_cnpj) REFERENCES usuario (cpf_cnpj), 
	FOREIGN KEY(produto_id) REFERENCES produto (id)
)

;


CREATE TABLE listagem (
	id SERIAL NOT NULL, 
	produto_id INTEGER, 
	nome_personalizado VARCHAR(255), 
	preco DECIMAL(10, 2), 
	estoque INTEGER, 
	produtor_cpf_cnpj VARCHAR, 
	preco_promocional DECIMAL(10, 2), 
	unidade VARCHAR(50), 
	descricao VARCHAR(255), 
	foto VARCHAR(100), 
	PRIMARY KEY (id), 
	FOREIGN KEY(produto_id) REFERENCES produto (id), 
	FOREIGN KEY(produtor_cpf_cnpj) REFERENCES produtor (cpf_cnpj)
)

;


CREATE TABLE pedido (
	id SERIAL NOT NULL, 
	produto VARCHAR, 
	quantidade INTEGER, 
	valor INTEGER, 
	momento_compra TIMESTAMP WITHOUT TIME ZONE, 
	status VARCHAR, 
	avaliacao VARCHAR, 
	cpf_usuario VARCHAR, 
	id_endereco INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(cpf_usuario) REFERENCES usuario (cpf_cnpj), 
	FOREIGN KEY(id_endereco) REFERENCES endereco (id)
)

;


CREATE TABLE usuario_produtor_favorito (
	usuario_cpf_cnpj VARCHAR NOT NULL, 
	produtor_cpf_cnpj VARCHAR NOT NULL, 
	PRIMARY KEY (usuario_cpf_cnpj, produtor_cpf_cnpj), 
	FOREIGN KEY(usuario_cpf_cnpj) REFERENCES usuario (cpf_cnpj), 
	FOREIGN KEY(produtor_cpf_cnpj) REFERENCES produtor (cpf_cnpj)
)

;

