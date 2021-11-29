const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const segredo = require("../segredo");
const schemaCadastroUsuario = require('../validacoes/schemaCadastroUsuarios');
const schemaAtualizarUsuario = require('../validacoes/schemaAtualizarUsuarios');

const cadastrarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  
  try {

    await schemaCadastroUsuario.validate(req.body);
  

    const { rowCount: quantidadeUsuarios } = await conexao.query(
      "select * from usuarios where email = $1",
      [email]
    );

    if (quantidadeUsuarios > 0) {
      return res
        .status(400)
        .json({ mensagem: "O email informado já foi cadastrado" });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);


    const query =
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)";
    const usuarioCadastrado = await conexao.query(query, [
      nome,
      email,
      senhaCriptografada,
    ]);

    if (usuarioCadastrado.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possivel cadastar o usuário" });
    }

    return res.status(201).json();
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

const detalharUsuario = async (req, res) => {
  const { usuario } = req;

  return res.status(200).json(usuario);
};

const atualizarUsuario = async (req, res) => {
  const { usuario } = req;
  const { nome, email, cpf, telefone, senha } = req.body;

  
  try {

    await schemaAtualizarUsuario.validate(req.body);


    if (email !== usuario.email) {
      const validarEmail = await conexao.query(
        "select * from usuarios where email = $1",
        [email]
      );

      if (validarEmail.rowCount > 0) {
        return res.status(401).json({
          mensagem:
            "O e-mail informado já está sendo utilizado por outro usuário.",
        });
      }
    }
    if (cpf !== usuario.cpf) {
      const validarCPF = await conexao.query(
        "select * from usuarios where cpf = $1",
        [cpf]
      );

      if (validarCPF.rowCount > 0) {
        return res.status(401).json({
          mensagem: "CPF já cadastrado",
        });
      }
    }
    let usuarioAtualizado;
    if (senha) {
      const senhaCriptografada = await bcrypt.hash(senha, 10);

      const query =
        "update usuarios set (nome, email, senha, cpf, telefone) = ($1, $2, $3, $4, $5) where id = $6";
      usuarioAtualizado = await conexao.query(query, [
        nome,
        email,
        senhaCriptografada,
        cpf,
        telefone,
        usuario.id,
      ]);
    } else {
      const query =
        "update usuarios set (nome, email, cpf, telefone) = ($1, $2, $3, $4) where id = $5";
      usuarioAtualizado = await conexao.query(query, [
        nome,
        email,
        cpf,
        telefone,
        usuario.id,
      ]);
    }

    if (usuarioAtualizado.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Não foi possível atualizar o usuario" });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrarUsuario,
  detalharUsuario,
  atualizarUsuario,
};
