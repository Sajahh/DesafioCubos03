CREATE DATABASE dindin;

create table if not exists usuarios (
  id serial primary key,
  nome text not null,
  email text not null,
  senha text not null
);

create table if not exists categorias (
  	id serial primary key,
  	descricao text not null
  );

create table if not exists transacoes (
	id serial primary key,
  	descricao text not null,
  	valor int not null,
  	data date not null,
  	categoria_id int not null,
  	usuario_id int not null,
  	tipo text not null,
  	foreign key (categoria_id) references categorias (id),
  	foreign key (usuario_id) references usuarios (id)
);

insert into categorias (descricao) values 
('Alimentação'),
('Assinaturas e Serviços'),
('Casa'),
('Mercado'),
('Cuidados Pessoais'),
('Educação'),
('Família'),
('Lazer'),
('Pets'),
('Presentes'),
('Roupas'),
('Saúde'),
('Transporte'),
('Salário'),
('Vendas'),
('Outras receitas'),
('Outras despesas');
