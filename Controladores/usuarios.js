const conexao = require('../db')
const securePassword = require("secure-password")
const jwt = require("jsonwebtoken")
const chaveSecreta = require('../jwt_secret')
const pwd = securePassword()

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json('Todos os campos são obrigatórios')
    }
    try {
        const query = 'select * from usuarios where email = $1'
        const usuario = await conexao.query(query, [email]);

        if (usuario.rowCount > 0) {
            return res.status(400).json('Esse email já foi cadastrado')
        }
    } catch (error) {
        return res.status(400).json(error.message)
    }

    try {
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query = 'insert into usuarios (nome,email,senha) values ($1, $2, $3)'
        const usuario = await conexao.query(query, [nome, email, hash]);
        if (usuario.rowCount === 0) {
            return res.status(400).json('Não foi possível cadastrar o usuário')
        }

        return res.status(200).json('Usuário cadastrado com sucesso')

    } catch (error) {
        return res.status(400).json(error.message)
    }



}

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json('Todos os campos são obrigatórios')
    }

    try {
        const query = 'select * from usuarios where email = $1'
        const usuarios = await conexao.query(query, [email]);

        if (usuarios.rowCount === 0) {
            return res.status(400).json('Email ou senha incorretos')
        }

        const usuario = usuarios.rows[0];

        const result = await pwd.verify(Buffer.from(senha), Buffer.from(usuario.senha, "hex"))

        switch (result) {
            case securePassword.INVALID_UNRECOGNIZED_HASH:
            case securePassword.INVALID:
                return res.status(400).json('Email ou senha incorretos')
            case securePassword.VALID:
                break;
            case securePassword.VALID_NEEDS_REHASH:
                try {
                    const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
                    const query = 'update usarios set senha = $1 where email = $2'
                    const usuario = await conexao.query(query, [hash, email]);
                } catch {
                }
                break
        }
        const token = jwt.sign({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
        }, chaveSecreta)

        const usuario_Objeto = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            token
        }
        return res.status(200).json(usuario_Objeto);
    } catch (error) {
        return res.status(400).json(error.message)
    }
};

const detalharUsuario = async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]

    try {
        const { id } = await jwt.verify(token, chaveSecreta)
        const query = 'select * from usuarios where id = $1'
        const usuarios = await conexao.query(query, [id])
        if (usuarios.rowCount === 0) {
            return res.status(404).json('Usuario não cadastrado');
        }

        const usuario = usuarios.rows[0];
        const usuarioDetalhado = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
        }
        return res.status(200).json(usuarioDetalhado)
    }
    catch (error) {
        return res.status(400).json(error.message)
    }
}

const atualizarUsuario = async (req, res) => {
    const { nome, email, senha } = req.body
    const token = req.headers['authorization'].split(' ')[1]

    try {
        const { id } = await jwt.verify(token, chaveSecreta)
        if (!nome || !email || !senha) {
            return res.status(400).json('Todos os campos são obrigatórios')
        }
        if (email.rowCount > 0) {
            return res.status(400).json('Esse email já foi cadastrado')
        }
        const hash = (await pwd.hash(Buffer.from(senha))).toString("hex");
        const query = 'update usuarios set nome = $2, email = $3, senha = $4 where id = $1'
        const usuarioAtualizado = await conexao.query(query, [id, nome, email, hash])

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(404).json('Não foi possível atualizar o usuário')
        }
        return res.status(200).json()

    } catch (error) {
        return res.status(400).json(error.message)
    }
}











module.exports = {
    cadastrarUsuario,
    login,
    detalharUsuario,
    atualizarUsuario
}