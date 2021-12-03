const conexao = require("../conexao");
const datefns = require('date-fns');

const listarCobrancas = async (req, res) => {

    const agora = new Date();
    const dataFormatada = datefns.format(agora, "yyy-MM-dd");

    try {
        const {rows: listaDeCobrancas} = await conexao.query('select * from cobrancas');

        for (let i = 0; i < listaDeCobrancas.length; i++){
            
            if(listaDeCobrancas[i].paga === false){
                if (listaDeCobrancas[i].data_vencimento < dataFormatada){
                    listaDeCobrancas[i].status = "vencida";
                } else {
                    listaDeCobrancas[i].status = "pendente"
                }
            } else {
                listaDeCobrancas[i].status = "paga"
            }
        }
        
        return res.status(200).json(listaDeCobrancas);
        
    } catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }


}

const listarCobrancasDeCadaCliente = async (req, res) => {
    const {idCliente} = req.params
    const agora = new Date();
    const dataFormatada = datefns.format(agora, "yyy-MM-dd");

    try {
        const {rows: listaDeCobrancasCliente} = await conexao.query('select * from cobrancas where cliente_id = $1', [idCliente]);

        for (let i = 0; i < listaDeCobrancasCliente.length; i++){
            
            if(listaDeCobrancasCliente[i].paga === false){
                if (listaDeCobrancasCliente[i].data_vencimento < dataFormatada){
                    listaDeCobrancasCliente[i].status = "vencida";
                } else {
                    listaDeCobrancasCliente[i].status = "pendente"
                }
            } else {
                listaDeCobrancasCliente[i].status = "paga"
            }
        }
        
        return res.status(200).json(listaDeCobrancasCliente);
        
    } catch (error) {
        return res.status(404).json({ mensagem: error.message });
    }

}

module.exports = {
    listarCobrancas,
    listarCobrancasDeCadaCliente
}