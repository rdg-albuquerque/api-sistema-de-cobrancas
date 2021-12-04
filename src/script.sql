create database desafio_final;

create table if not exists usuarios (
	id serial primary key,
  	nome text not null,
  	email text not null unique,
  	senha text not null,
  	cpf text unique,
  	telefone text 
);

create table if not exists clientes (
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

create table if not exists cobrancas(
	id serial primary key,
  	cliente_id integer  not null references clientes (id),
  	nome text not null,
  	descricao text not null,
  	data_vencimento text not null,
  	valor text not null,
  	paga boolean not null 
);