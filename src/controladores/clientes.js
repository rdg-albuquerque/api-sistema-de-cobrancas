const conexao = require("../conexao");
const schemaCadastroCliente = require('../validacoes/schemaCadastroClientes');

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
        .json({ mensagem: "Não foi possivel cadastrar o produto" });
    }

    return res.status(204).json();
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const listarClientes = async (req, res) => {
  
  try {
    const listaDeClientes = await conexao.query(
      "select * from clientes"
    );

    for (cliente of listaDeClientes){
      const {rowCount} = await conexao.query('select * from cobrancas where cliente_id = $1 and data_vencimento < current_date', [cliente.id]);

      if (rowCount > 0){
        cliente.status = 'inadimplente'
      } else {
        cliente.status = 'em dia'
      }
    }

    return res.status(200).json(listaDeClientes.rows);
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const detalharCliente = async (req, res) => {
  const {id} = req.params;

  try {

    const buscarCliente = await conexao.query("select * from clientes where id = $1", [id]);

    if (buscarCliente.rowCount === 0) {
      return res.status(404).json({mensagem: "Cliente não encontrado"});
    }

    return res.status(200).json(buscarCliente.rows[0]);
    
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
}

module.exports = {
  cadastrarCliente,
  listarClientes,
  detalharCliente
};
