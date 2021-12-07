const yup = require('./configuracao');

const schemaCadastroCliente = yup.object().shape({
    nome: yup.string().required(),
    email: yup.string().required().email(),
    telefone: yup.string().required(),
    cpf: yup.string().required(),
    endereco: yup.string(),
    complemento: yup.string(),
    cep: yup.string(),
    bairro: yup.string(),
    cidade: yup.string(),
    uf: yup.string()
})

module.exports = schemaCadastroCliente;