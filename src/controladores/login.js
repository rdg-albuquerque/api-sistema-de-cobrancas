const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const segredo = require("../segredo");

const login = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ mensagem: "E-mail e senha são obrigatórios" });

    }

    let query = "SELECT id, email, senha FROM usuarios WHERE email = $1";
    const emailExistente = await conexao.query(query, [email]);
    if (emailExistente.rowCount === 0) {
        return res.status(404).json({ mensagem: "Usuário ou senha inválido" });
    }

    const { id, email: emailCadastrado, senha: senhaCadastrada } = emailExistente.rows[0];
    const senhaValida = await bcrypt.compare(senha, senhaCadastrada);
    if (!senhaValida) {
        return res.status(400).json({ mensagem: "Usuário ou senha inválidos" });
    }


    const token = jwt.sign({ id }, segredo, { expiresIn: "2h" });
    return res.status(201).json({ token });

}

module.exports = {
    login
};