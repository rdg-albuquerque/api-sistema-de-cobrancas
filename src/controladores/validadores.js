const conexao = require("../conexao");

const validarEmail = async (req, res) => {

    const { email } = req.body;
    const { rowCount: quantidadeUsuarios } = await conexao.query('select * from usuarios where email = $1', [email]);

    if (quantidadeUsuarios > 0) {
        return res.status(400).json();
    }

}



module.exports = {
    validarEmail
}