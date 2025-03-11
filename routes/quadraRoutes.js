const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Quadra = require('../models/Quadra');

// Rota para listar todas as quadras e lidar com a pesquisa
router.get('/', async (req, res) => {
    try {
        const search = req.query.search || '';
        const quadras = await Quadra.findAll({
            where: {
                [Op.or]: [
                    { nome: { [Op.iLike]: `%${search}%` } },
                    { localizacao: { [Op.iLike]: `%${search}%` } }
                ]
            }
        });
        res.render('index', { quadras });
    } catch (error) {
        console.error('Erro ao buscar quadras:', error);
        res.status(500).send('Erro ao buscar quadras');
    }
});

// Rota para exibir detalhes de uma quadra específica
router.get('/quadra/:id', async (req, res) => {
    try {
        const quadraId = parseInt(req.params.id, 10);
        const quadra = await Quadra.findByPk(quadraId);
        if (quadra) {
            res.render('quadra', { quadra });
        } else {
            res.status(404).send('Quadra não encontrada');
        }
    } catch (error) {
        console.error('Erro ao buscar quadra:', error);
        res.status(500).send('Erro ao buscar quadra');
    }
});

// Rota para exibir o formulário de adição de quadra
router.get('/add', (req, res) => {
    res.render('addQuadra');
});

// Rota para adicionar uma nova quadra
router.post('/add', async (req, res) => {
    try {
        const { nome, localizacao, descricao, preco, imagem, telefone, funcionamento_inicio, funcionamento_fim } = req.body;
        const funcionamento = `${funcionamento_inicio} até ${funcionamento_fim}`;
        await Quadra.create({ nome, localizacao, descricao, preco, imagem, telefone, funcionamento });
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao adicionar quadra:', error);
        res.status(500).send('Erro ao adicionar quadra');
    }
});

module.exports = router;