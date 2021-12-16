const yup = require("./configuracao");

const schemaEdicaoCobranca = yup.object().shape({
  descricao: yup.string().required(),
  data_vencimento: yup.string().required(),
  valor: yup.string().required(),
  paga: yup.boolean().required(),
});

module.exports = schemaEdicaoCobranca;
