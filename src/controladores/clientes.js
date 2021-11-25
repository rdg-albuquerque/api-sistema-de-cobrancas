const conexao = require("../conexao");

const cadastrarCliente = async (req, res) => {
    const {usuario} = req;
    const {nome, email, telefone, cpf, endereco, complemento, cep, bairro, cidade, uf} = req.body;


    if (!nome){
        return res.status(400).json({mensagem: 'O campo nome é obrigatorio'})
    }

    if (!email){
        return res.status(400).json({mensagem: 'O campo email é obrigatorio'})
    }

    if (!telefone){
        return res.status(400).json({mensagem: 'O campo telefone é obrigatorio'})
    }

    if (!cpf){
        return res.status(400).json({mensagem: 'O campo cpf é obrigatorio'})
    }


    const {rowCount: quantidadeUsuarios} = await conexao.query('select * from usuarios where email = $1', [email]);
        
    if (quantidadeUsuarios > 0 ){
        return res.status(400).json({mensagem: 'O email informado já foi cadastrado'});
    }

    try {
        
        const query = 'insert into clientes (usuario_id, nome, email, telefone, cpf, endereco, complemento, cep, bairro, uf) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';

        const clienteCadastrado = await conexao.query(query, [usuario.id, nome, email, telefone, cpf, endereco, complemento, cep, bairro, uf]);

        if (clienteCadastrado.rowCount === 0 ) {
            return res.status(400).json({mensagem: 'Não foi possivel cadastrar o produto'});
        }

        return res.status(204).json()
        


    } catch (error) {
        return res.status(404).json({mensagem: error.message})
    }


}

const listarClientes = async (req, res) => {
    const {usuario} = req;

    try {
        const listaDeClientes = await conexao.query('select * from clientes where usuario_id = $1', [usuario.id]);

        return res.status(200).json(listaDeClientes.rows);

    } catch (error) {
        return res.status(404).json({mensagem: error.message})
    }
}


module.exports = {
    cadastrarCliente,
    listarClientes
}