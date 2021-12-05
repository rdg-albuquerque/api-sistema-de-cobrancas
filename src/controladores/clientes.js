const conexao = require("../conexao");
const schemaCadastroCliente = require("../validacoes/schemaCadastroClientes");
const datefns = require("date-fns");

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

  try {
    await schemaCadastroCliente.validate(req.body);

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
      "insert into clientes (nome, email, telefone, cpf, endereco, complemento, cep, bairro, cidade, uf) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)";

    const clienteCadastrado = await conexao.query(query, [
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
        .json({ mensagem: "Não foi possivel cadastrar o cliente" });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const listarClientes = async (req, res) => {
  const agora = new Date();
  const dataFormatada = datefns.format(agora, "yyy-MM-dd");

  try {
    const { rows: listaDeClientes } = await conexao.query(
      "select * from clientes"
    );
    for (let cliente of listaDeClientes) {
      const { rowCount } = await conexao.query(
        "select * from cobrancas where cliente_id = $1 and data_vencimento < $2 and paga = $3",
        [cliente.id, dataFormatada, false]
      );

      if (rowCount > 0) {
        cliente.status = "Inadimplente";
      } else {
        cliente.status = "Em dia";
      }
    }

    return res.status(200).json(listaDeClientes);
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const detalharCliente = async (req, res) => {
  const { id } = req.params;

  try {
    const buscarCliente = await conexao.query(
      "select * from clientes where id = $1",
      [id]
    );

    if (buscarCliente.rowCount === 0) {
      return res.status(404).json({ mensagem: "Cliente não encontrado" });
    }

    return res.status(200).json(buscarCliente.rows[0]);
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const editarCliente = async (req, res) => {
  const { id: id_cliente } = req.params;
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

  try {
    await schemaCadastroCliente.validate(req.body);

    const {
      rows: [cliente],
    } = await conexao.query("select * from clientes where id = $1", [
      id_cliente,
    ]);
    console.log(cliente);
    if (email !== cliente.email) {
      const { rowCount: qtdEmails } = await conexao.query(
        "select * from clientes where email = $1",
        [email]
      );

      if (qtdEmails > 0) {
        return res
          .status(400)
          .json({ mensagem: "O email informado já foi cadastrado" });
      }
    }

    if (cpf !== cliente.cpf) {
      const { rowCount: qtdCpfs } = await conexao.query(
        "select * from clientes where cpf = $1",
        [cpf]
      );

      if (qtdCpfs > 0) {
        return res
          .status(400)
          .json({ mensagem: "O cpf informado já foi cadastrado" });
      }
    }

    const query =
      "update clientes set (nome, email, telefone, cpf, endereco, complemento, cep, bairro, cidade, uf) = ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) where id = $11";

    const clienteEditado = await conexao.query(query, [
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
      id_cliente,
    ]);

    if (clienteEditado.rowCount === 0) {
      return res
        .status(400)
        .json({ mensagem: "Não foi possivel editar o cliente" });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastrarCliente,
  listarClientes,
  detalharCliente,
  editarCliente,
};
