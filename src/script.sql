create database desafio_final;

drop table if exists usuarios;
create table usuarios (
	id serial primary key,
  	nome text not null,
  	email text not null unique,
  	senha text not null,
  	cpf text unique,
  	telefone text 
);

drop table if exists clientes;
create table clientes (
	id serial primary key,
	inadimplencia boolean default false,
  	nome text not null,
  	email text not null unique,
  	telefone text not null,
  	cpf text not null unique, 
  	endereco text,
  	complemento text,
  	cep text,
  	bairro text,
  	cidade text,
  	uf text
);

drop table if exists cobrancas;
create table cobrancas(
	id serial primary key,
  	cliente_id integer  not null references clientes (id),
  	descricao text not null,
  	data_vencimento text not null,
  	valor integer not null,
  	paga boolean not null 
);