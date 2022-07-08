const express = require('express');
const rotas = express();
const transacoes = require('./controladores/transacoes');
const categorias = require('./controladores/categorias');
const usuarios = require('./controladores/usuarios');
const verificarLogin = require('./Filtros/verificaLogin');
const jwt = require("jsonwebtoken");
const chaveSecreta = require('./jwt_secret');


rotas.post('/cadastrar', usuarios.cadastrarUsuario);
rotas.post('/login', usuarios.login);

rotas.use(verificarLogin);

rotas.put('/usuario', usuarios.atualizarUsuario);
rotas.get('/usuario', usuarios.detalharUsuario);

rotas.get('/extrato', transacoes.extrato);
rotas.get('/transacoes', transacoes.listarTransacao);
rotas.get('/transacoes/:id', transacoes.detalharTransacao);
rotas.post('/transacoes', transacoes.cadastrarTransacao);
rotas.put('/transacoes/:id', transacoes.editarTransacao);
rotas.delete('/transacoes/:id', transacoes.deletarTransacao);

rotas.get('/categorias', categorias.listarCategorias);



module.exports = rotas;