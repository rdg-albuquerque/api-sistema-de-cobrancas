const yup = require("./configuracao");

const schemaAtualizarUsuario = yup.object().shape({
  nome: yup.string().required(),
  email: yup.string().required().email(),
  senha: yup.string().when({
    is: (senha) => senha.length > 0,
    then: yup.string().min(5),
  }),
  cpf: yup.string(),
  telefone: yup.string(),
});

module.exports = schemaAtualizarUsuario;
