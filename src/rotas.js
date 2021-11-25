const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const validarUsuario = require('./midleware/validarUsuarios');
const clientes = require('./controladores/clientes');

const rotas = express();


rotas.post('/usuario', usuarios.cadastrarUsuario);
rotas.post('/login', login.login);

rotas.use(validarUsuario);

//usuario
rotas.get('/usuario', usuarios.detalharUsuario);
rotas.put('/usuario', usuarios.atualizarUsuario);

//cliente
rotas.post('/cliente', clientes.cadastrarCliente);
rotas.get('/cliente', clientes.listarClientes);

module.exports = rotas;