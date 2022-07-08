const { query } = require('express');
const conexao = require('../db')
const jwt = require("jsonwebtoken")
const chaveSecreta = require('../jwt_secret')


const listarTransacao = async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1];
    try {

        const { id } = await jwt.verify(token, chaveSecreta);
        const query = 'select * from transacoes where usuario_id = $1'
        const { rows: transacoes } = await conexao.query(query, [id]);
        return res.status(200).json(transacoes)

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const detalharTransacao = async (req, res) => {
    const { id } = req.params;
    const token = req.headers['authorization'].split(' ')[1];

    try {
        const { id: identificador } = await jwt.verify(token, chaveSecreta);
        const query = 'select * from transacoes where id = $1';
        const { rows: transacoes } = await conexao.query(query, [id]);
        if (transacoes.rowCount === 0) {
            return res.status(404).json('Transação não encontrada')
        };
        return res.status(200).json(transacoes)
    } catch (error) {
        return res.status(400).json(error.message);
    };
};

const cadastrarTransacao = async (req, res) => {
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const token = req.headers['authorization'].split(' ')[1]


    try {

        const { id } = await jwt.verify(token, chaveSecreta)

        if (!descricao) {
            return res.status(400).json('O campo descrição é obrigatório')
        }
        if (!valor) {
            return res.status(400).json('O campo valor é obrigatório')
        }
        if (!data) {
            return res.status(400).json('O campo data é obrigatório')
        }
        if (!tipo) {
            return res.status(400).json('O campo tipo é obrigatório')
        }
        const query = 'insert into transacoes (descricao, valor, data, categoria_id, tipo, usuario_id) values ($1, $2, $3, $4, $5, $6)'
        const transacao = await conexao.query(query, [descricao, valor, data, categoria_id, tipo, id])
        if (transacao.rowCount === 0) {
            return res.status(404).json('Não foi possível cadastrar sua transação')
        }
        return res.status(200).json('Transação cadastrada com sucesso')
    } catch (error) {
        return res.status(400).json(error.message)
    }
}


const editarTransacao = async (req, res) => {
    const { id } = req.params
    const { descricao, valor, data, categoria_id, tipo } = req.body
    const token = req.headers['authorization'].split(' ')[1]

    try {
        const { id: identificador } = await jwt.verify(token, chaveSecreta)
        const query = 'select * from transacoes where id = $1'
        const transacao = await conexao.query(query, [id]);
        if (transacao.rowCount === 0) {
            return res.status(404).json('Transação não encontrada')
        }
        if (!descricao) {
            return res.status(400).json('O campo descrição é obrigatório')
        }
        if (!valor) {
            return res.status(400).json('O campo valor é obrigatório')
        }
        if (!data) {
            return res.status(400).json('O campo data é obrigatório')
        }
        if (!tipo) {
            return res.status(400).json('O campo tipo é obrigatório')
        }

        const segundaQuery = 'update transacoes set descricao = $1, valor = $2, data= $3, categoria_id = $4, tipo = $5 where id = $6'
        const transacaoEditada = await conexao.query(segundaQuery, [descricao, valor, data, categoria_id, tipo, id])
        if (transacaoEditada.rowCount === 0) {
            return res.status(404).json('Não foi possível atualizar a transação')
        }
        return res.status(200).json('Transação atualizada com sucesso')
    } catch (error) {
        return res.status(400).json(error.message)
    }

}

const deletarTransacao = async (req, res) => {
    const { id } = req.params
    const token = req.headers['authorization'].split(' ')[1]


    try {
        const { id: identificador } = await jwt.verify(token, chaveSecreta)
        const query = 'select * from transacoes where id = $1'
        const transacao = await conexao.query(query, [id]);
        if (transacao.rowCount === 0) {
            return res.status(404).json('Transação não encontrada')
        }
        const segundaQuery = 'delete from transacoes where id = $1'
        const transacaoDeletada = await conexao.query(segundaQuery, [id])
        if (transacaoDeletada.rowCount === 0) {
            return res.status(404).json('Não foi possível deletar a transação')
        }
        return res.status(200).json('A transação foi deletada com sucesso')
    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const extrato = async (req, res) => {
    const token = req.headers['authorization'].split(' ')[1]

    try {
        const { id } = await jwt.verify(token, chaveSecreta)
        let entrada = 0
        let saida = 0
        const query = 'select * from transacoes where usuario_id = $1'
        const extrato = await conexao.query(query, [id])
        extrato.rows.forEach(element => {
            if (element.tipo === "entrada") {
                entrada += element.valor
            } else {
                saida += element.valor
            }
        });
        const extratoCompleto = {
            entrada: entrada,
            saida: saida
        }
        return res.status(200).json(extratoCompleto)
    } catch (error) {
        return res.status(400).json(error.message)
    }
}








module.exports = {
    listarTransacao,
    detalharTransacao,
    cadastrarTransacao,
    editarTransacao,
    deletarTransacao,
    extrato
}