const express = require("express");
const usuarios = require("./controladores/usuarios");
const login = require("./controladores/login");
const validarUsuario = require("./midleware/validarUsuarios");
const clientes = require("./controladores/clientes");
const validadores = require("./controladores/validadores");
const cobrancas = require("./controladores/cobrancas");

const rotas = express();

rotas.post("/usuario", usuarios.cadastrarUsuario);
rotas.post("/login", login.login);

// validadores
rotas.post("/validador", validadores.validarEmail);

rotas.use(validarUsuario);

//usuario
rotas.get("/usuario", usuarios.detalharUsuario);
rotas.put("/usuario", usuarios.atualizarUsuario);

//cliente
rotas.post("/cliente", clientes.cadastrarCliente);
rotas.get("/cliente", clientes.listarClientes);
rotas.get("/cliente/:id", clientes.detalharCliente);
rotas.put("/cliente/:id", clientes.editarCliente);

// cobrancas
rotas.post("/cobrancas/:idCliente", cobrancas.cadastroCobranca);
rotas.get("/cobrancas", cobrancas.listarCobrancas);
rotas.get("/cobrancas/:idCliente", cobrancas.listarCobrancasDeCadaCliente);
rotas.put("/cobrancas/:idCobranca", cobrancas.editarCobranca);

rotas.get("/cobranca/:idCobranca", cobrancas.detalharCadaCobranca);
rotas.delete("/cobrancas/:id", cobrancas.excluirCobrancas);

module.exports = rotas;
