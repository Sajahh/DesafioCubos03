const jwt = require("jsonwebtoken")
const chaveSecreta = require('../jwt_secret')
const conexao = require('../db')



const verificarLogin = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(404).json('Token não informado')
    }
    try {
        const token = authorization.replace('Bearer', '').trim();
        const { id } = await jwt.verify(token, chaveSecreta)

        const query = 'select * from usuarios where id = $1'
        const usuarios = await conexao.query(query, [id]);
        if (usuarios.rowCount === 0) {
            return res.status(400).json('Email ou senha incorretos')
        }

        const { senha, ...usuario } = usuarios.rows[0];

        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(400).json(error.message)
    }
}



module.exports = verificarLogin;