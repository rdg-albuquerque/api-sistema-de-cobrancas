const conexao = require("../conexao");

const validarEmail = async (req, res) => {
  const { email } = req.body;
  try {
    const { rowCount: quantidadeUsuarios } = await conexao.query(
      "select * from usuarios where email = $1",
      [email]
    );
    if (quantidadeUsuarios > 0) {
      return res
        .status(400)
        .json({ mensagem: "O e-mail informado já está em uso" });
    }

    res.json("E-mail válido");
  } catch (error) {
    res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  validarEmail,
};
