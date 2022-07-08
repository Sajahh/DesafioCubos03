const conexao = require('../db')
const jwt = require("jsonwebtoken")
const chaveSecreta = require('../jwt_secret')

const listarCategorias = async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]

    try {
        const { id } = await jwt.verify(token, chaveSecreta)

        const query = 'select * from categorias'
        const { rows: categorias } = await conexao.query(query)
        return res.status(200).json(categorias)

    } catch (error) {
        return res.status(400).json(error.message)
    }
}





module.exports = {
    listarCategorias
}
