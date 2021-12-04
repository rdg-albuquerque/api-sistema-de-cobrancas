const yup = require("./configuracao");

const schemaAdicionarCobranca = yup.object().shape({
  nome: yup.string().required(),
  descricao: yup.string().required(),
  data_vencimento: yup.string().required(),
  valor: yup.string().required(),
  paga: yup.boolean().required(),
});

module.exports = schemaAdicionarCobranca;
