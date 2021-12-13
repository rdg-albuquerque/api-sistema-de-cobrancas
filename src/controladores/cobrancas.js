const conexao = require("../conexao");
const datefns = require("date-fns");
const schemaCadastroCobranca = require("../validacoes/schemaCadastroCobranca");

const listarCobrancas = async (req, res) => {
  const agora = new Date();
  const dataFormatada = datefns.format(agora, "yyy-MM-dd");

  try {
    const { rows: listaDeCobrancas } = await conexao.query(
      "select cobrancas.id, cliente_id, descricao, data_vencimento, valor, paga, clientes.nome as cliente_nome from cobrancas left join clientes on cobrancas.cliente_id = clientes.id"
    );
    

    for (let i = 0; i < listaDeCobrancas.length; i++) {
      if (listaDeCobrancas[i].paga === false) {
        if (listaDeCobrancas[i].data_vencimento < dataFormatada) {
          listaDeCobrancas[i].status = "Vencida";
        } else {
          listaDeCobrancas[i].status = "Pendente";
        }
      } else {
        listaDeCobrancas[i].status = "Paga";
      }
    }
    

    return res.status(200).json(listaDeCobrancas);
  } catch (error) {
    console.log('cai no catch');
    return res.status(404).json({ mensagem: error.message });
  }
};

const listarCobrancasDeCadaCliente = async (req, res) => {
  const { idCliente } = req.params;
  const agora = new Date();
  const dataFormatada = datefns.format(agora, "yyy-MM-dd");

  try {
    const { rows: listaDeCobrancasCliente } = await conexao.query(
      "select * from cobrancas where cliente_id = $1",
      [idCliente]
    );

    for (let i = 0; i < listaDeCobrancasCliente.length; i++) {
      if (listaDeCobrancasCliente[i].paga === false) {
        if (listaDeCobrancasCliente[i].data_vencimento < dataFormatada) {
          listaDeCobrancasCliente[i].status = "Vencida";
        } else {
          listaDeCobrancasCliente[i].status = "Pendente";
        }
      } else {
        listaDeCobrancasCliente[i].status = "Paga";
      }
    }

    return res.status(200).json(listaDeCobrancasCliente);
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const cadastroCobranca = async (req, res) => {
  const { idCliente } = req.params;
  const { descricao, data_vencimento, valor, paga } = req.body;

  try {
    await schemaCadastroCobranca.validate(req.body);

    const query =
      "insert into cobrancas (cliente_id, descricao, data_vencimento, valor, paga) values ($1, $2, $3, $4, $5)";

    const cobrancaCadastrada = await conexao.query(query, [
      idCliente,
      descricao,
      data_vencimento,
      valor,
      paga,
    ]);

    return res.status(200).json(cobrancaCadastrada);
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
};

const detalharCadaCobranca = async (req, res) => {
  const { idCobranca } = req.params;
  const agora = new Date();
  const dataFormatada = datefns.format(agora, "yyy-MM-dd");

  try {
    const {rows: buscarCobranca} = await conexao.query(
      "select * from cobrancas where id = $1",
      [idCobranca]
    );


    if (buscarCobranca[0].paga === false) {
      if (buscarCobranca[0].data_vencimento < dataFormatada) {
        buscarCobranca[0].status = "Vencida";
      } else {
        buscarCobranca[0].status = "Pendente";
      }
    } else {
      buscarCobranca[0].status = "Paga";
    }    

    if (buscarCobranca.rowCount === 0) {
      return res.status(404).json({ mensagem: "cobranca não encontrado" });
    }

    return res.status(200).json(buscarCobranca);
  } catch (error) {
    return res.status(404).json({ mensagem: error.message });
  }
}


module.exports = {
  cadastroCobranca,
  listarCobrancas,
  listarCobrancasDeCadaCliente,
  detalharCadaCobranca
};
