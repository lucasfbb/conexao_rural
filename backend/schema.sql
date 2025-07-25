
CREATE TABLE produto (
	id SERIAL NOT NULL, 
	nome VARCHAR NOT NULL, 
	categoria VARCHAR, 
	sazonal BOOLEAN, 
	PRIMARY KEY (id)
)

;


CREATE TABLE usuario (
	id SERIAL NOT NULL, 
	cpf_cnpj VARCHAR, 
	email VARCHAR, 
	senha VARCHAR, 
	nome VARCHAR, 
	e_vendedor BOOLEAN, 
	avaliacao VARCHAR, 
	foto_perfil VARCHAR(150), 
	foto_id VARCHAR(50),
	telefone_1 VARCHAR, 
	telefone_2 VARCHAR, 
	data_nascimento DATE, 
	criado_em TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id)
)

;


CREATE TABLE endereco (
	id SERIAL NOT NULL, 
	titulo VARCHAR, 
	cep VARCHAR, 
	estado VARCHAR, 
	cidade VARCHAR, 
	rua VARCHAR, 
	complemento VARCHAR, 
	referencia VARCHAR, 
	usuario_id INTEGER NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(usuario_id) REFERENCES usuario (id)
)

;


CREATE TABLE notificacao (
	id SERIAL NOT NULL, 
	usuario_id INTEGER NOT NULL, 
	titulo VARCHAR NOT NULL, 
	mensagem TEXT NOT NULL, 
	tipo VARCHAR, 
	lida BOOLEAN, 
	criado_em TIMESTAMP WITH TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(usuario_id) REFERENCES usuario (id)
)

;


CREATE TABLE produtor (
	id SERIAL NOT NULL, 
	usuario_id INTEGER NOT NULL, 
	banner VARCHAR(150),
	banner_id VARCHAR(50),
	foto VARCHAR(150),
	foto_id VARCHAR(50),
	categoria VARCHAR, 
	endereco VARCHAR, 
	rua VARCHAR, 
	numero VARCHAR, 
	complemento VARCHAR, 
	bairro VARCHAR, 
	nome VARCHAR, 
	PRIMARY KEY (id), 
	UNIQUE (usuario_id), 
	FOREIGN KEY(usuario_id) REFERENCES usuario (id)
)

;


CREATE TABLE usuario_produto_favorito (
	usuario_id INTEGER NOT NULL, 
	produto_id INTEGER NOT NULL, 
	PRIMARY KEY (usuario_id, produto_id), 
	FOREIGN KEY(usuario_id) REFERENCES usuario (id), 
	FOREIGN KEY(produto_id) REFERENCES produto (id)
)

;


CREATE TABLE certificado (
	id SERIAL NOT NULL, 
	produtor_id INTEGER NOT NULL, 
	nome VARCHAR NOT NULL, 
	instituicao VARCHAR, 
	validade DATE, 
	arquivo VARCHAR, 
	criado_em TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(produtor_id) REFERENCES produtor (id)
)

;


CREATE TABLE listagem (
	id SERIAL NOT NULL, 
	produto_id INTEGER, 
	nome_personalizado VARCHAR(255), 
	preco DECIMAL(10, 2), 
	estoque INTEGER, 
	produtor_id INTEGER NOT NULL, 
	preco_promocional DECIMAL(10, 2), 
	unidade VARCHAR(50), 
	descricao VARCHAR(255), 
	foto VARCHAR(150),
	foto_id VARCHAR(50),
	PRIMARY KEY (id), 
	FOREIGN KEY(produto_id) REFERENCES produto (id), 
	FOREIGN KEY(produtor_id) REFERENCES produtor (id)
)

;


CREATE TABLE pedido (
	id SERIAL NOT NULL, 
	quantidade INTEGER, 
	valor INTEGER, 
	momento_compra TIMESTAMP WITHOUT TIME ZONE, 
	status VARCHAR, 
	group_hash VARCHAR, 
	avaliacao VARCHAR, 
	usuario_id INTEGER, 
	id_endereco INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(usuario_id) REFERENCES usuario (id), 
	FOREIGN KEY(id_endereco) REFERENCES endereco (id)
)

;


CREATE TABLE usuario_produtor_favorito (
	usuario_id INTEGER NOT NULL, 
	produtor_id INTEGER NOT NULL, 
	PRIMARY KEY (usuario_id, produtor_id), 
	FOREIGN KEY(usuario_id) REFERENCES usuario (id), 
	FOREIGN KEY(produtor_id) REFERENCES produtor (id)
)

;


CREATE TABLE item_pedido (
	id SERIAL NOT NULL, 
	pedido_id INTEGER, 
	produto_id INTEGER, 
	nome_personalizado VARCHAR, 
	quantidade INTEGER, 
	valor_unitario INTEGER, 
	listagem_id INTEGER, 
	PRIMARY KEY (id), 
	FOREIGN KEY(pedido_id) REFERENCES pedido (id), 
	FOREIGN KEY(produto_id) REFERENCES produto (id), 
	FOREIGN KEY(listagem_id) REFERENCES listagem (id)
)

;


CREATE TABLE pagamento (
	id SERIAL NOT NULL, 
	pedido_id INTEGER NOT NULL, 
	metodo VARCHAR, 
	status VARCHAR, 
	mp_preference_id VARCHAR, 
	mp_payment_id VARCHAR, 
	criado_em TIMESTAMP WITHOUT TIME ZONE, 
	PRIMARY KEY (id), 
	FOREIGN KEY(pedido_id) REFERENCES pedido (id)
)

;

