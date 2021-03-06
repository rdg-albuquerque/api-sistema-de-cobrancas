const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const schemaLogin = require("../validacoes/schemaLogin");

const login = async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) {
    return res
      .status(400)
      .json({ mensagem: "E-mail e senha são obrigatórios" });
  }

  try {
    await schemaLogin.validate(req.body);

    let query = "SELECT * FROM usuarios WHERE email = $1";
    const emailExistente = await conexao.query(query, [email]);
    if (emailExistente.rowCount === 0) {
      return res.status(404).json({ mensagem: "Usuário ou senha inválido" });
    }

    const {
      id,
      nome,
      email: emailCadastrado,
      cpf,
      telefone,
      senha: senhaCadastrada,
    } = emailExistente.rows[0];
    const senhaValida = await bcrypt.compare(senha, senhaCadastrada);
    if (!senhaValida) {
      return res.status(400).json({ mensagem: "Usuário ou senha inválidos" });
    }

    const token = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "2h" });
    return res
      .status(201)
      .json({ token, dados_usuario: { nome, email, cpf, telefone } });
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  login,
};
