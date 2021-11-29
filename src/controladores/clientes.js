const conexao = require("../conexao");

const cadastrarCliente = async (req, res) => {
  const { usuario } = req;
  const {
    nome,
    email,
    telefone,
    cpf,
    endereco,
    complemento,
    cep,
    bairro,
    cidade,
    uf,
  } = req.body;

  if (!nome) {
    return res.status(400).json({ mensagem: "O campo nome é obrigatorio" });
  }

  if (!email) {
    return res.status(400).json({ mensagem: "O campo email é obrigatorio" });
  }

  if (!telefone) {
    return res.status(400).json({ mensagem: "O campo telefone é obrigatorio" });
  }

  if (!cpf) {
    return res.status(400).json({ mensagem: "O campo cpf é obrigatorio" });
  }

  try {
    const { rowCount: qtdEmails } = await conexao.query(
      "select * from clientes where email = $1",
      [email]
    );

    if (qtdEmails > 0) {
      return res
        .status(400)
        .json({ mensagem: "O email informado já foi cadastrado" });
    }
    const { rowCount: qtdCpfs } = await conexao.query(
      "select * from clientes where cpf = $1",
      [cpf]
    );

    if (qtdCpfs > 0) {
      return res
        .status(400)
        .json({ mensagem: "O cpf informado já foi cadastrado" });
    }

    const query =
      "insert into clientes (usuario_id, nome, email, telefone, cpf, endereco, complemento, cep, bairro, cidade, uf) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)";

    const clienteCadastrado = await conexao.query(query, [
      usuario.id,
      nome,
      email,
      telefone,
      cpf,
      endereco,
      complemento,
      cep,
      bairro,
      cidade,
      uf,
    ]);

    if (clienteCadastrado.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possivel cadastrar o produto" });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const listarClientes = async (req, res) => {
  const { usuario } = req;

  try {
    const listaDeClientes = await conexao.query(
      "select * from clientes where usuario_id = $1",
      [usuario.id]
    );

    return res.status(200).json(listaDeClientes.rows);
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrarCliente,
  listarClientes,
};
