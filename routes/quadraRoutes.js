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
        const user = req.user; // Obtém o usuário logado
        if (quadra) {
            res.render('quadra', { quadra, user }); // Passa a quadra e o usuário para a view
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
    const user = req.user; // Obtém o usuário logado
    res.render('addQuadra', { user }); // Passa o usuário para a view
});

// Rota para adicionar uma nova quadra
router.post('/add', async (req, res) => {
    try {
        const { nome, localizacao, descricao, preco, imagem, telefone, funcionamento_inicio, funcionamento_fim } = req.body;
        const funcionamento = `${funcionamento_inicio} até ${funcionamento_fim}`;
        const donos_id = req.session.userId; // Obtém o ID do usuário logado
        console.log('ID do dono:', donos_id); // Verifica se o ID do dono está sendo obtido corretamente
        await Quadra.create({ nome, localizacao, descricao, preco, imagem, telefone, funcionamento, donos_id });
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao adicionar quadra:', error);
        res.status(500).send('Erro ao adicionar quadra');
    }
});

// Rota para deletar uma quadra
router.post('/quadra/:id/delete', async (req, res) => {
    try {
        const quadraId = parseInt(req.params.id, 10);

        // Busca a quadra pelo ID
        const quadra = await Quadra.findByPk(quadraId);

        if (!quadra) {
            return res.status(404).send('Quadra não encontrada');
        }

        // Deleta a quadra
        await quadra.destroy();
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao deletar quadra:', error);
        res.status(500).send('Erro ao deletar quadra');
    }
});
module.exports = router;