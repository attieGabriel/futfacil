const express = require('express');
const router = express.Router();
const multer = require('multer');
const Dono = require('../models/Dono'); // Certifique-se de que o caminho para o modelo Dono está correto

// Configuração do multer para armazenar arquivos em memória
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para exibir o formulário de registro
router.get('/register', (req, res) => {
    res.render('register');
});

// Rota para processar o registro de um novo usuário
router.post('/register', upload.single('imagem'), async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        const imagem = req.file ? req.file.buffer : null;
        await Dono.create({ nome, email, senha, imagem });
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        res.status(500).send('Erro ao registrar usuário');
    }
});

// Rota para exibir o formulário de login
router.get('/login', (req, res) => {
    res.render('login');
});

// Rota para processar o login de um usuário
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        const dono = await Dono.findOne({ where: { email, senha } });
        if (dono) {
            // Sucesso no login
            req.session.isAuthenticated = true;
            req.session.userId = dono.id;
            req.session.userImage = dono.imagem ? `data:image/jpeg;base64,${dono.imagem.toString('base64')}` : '/images/profile-icon.jpg';
            res.redirect('/');
        } else {
            // Falha no login
            res.status(401).send('Email ou senha incorretos');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).send('Erro ao fazer login');
    }
});

// Rota para logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Rota para exibir o formulário de edição de perfil
router.get('/profile', async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    const dono = await Dono.findByPk(req.session.userId);
    res.render('editProfile', { dono });
});

// Rota para processar a edição de perfil
router.post('/profile', upload.single('imagem'), async (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');
    }
    try {
        const { nome, email, senha } = req.body;
        const imagem = req.file ? req.file.buffer : null;
        const updateData = { nome, email, senha };
        if (imagem) {
            updateData.imagem = imagem;
        }
        await Dono.update(updateData, { where: { id: req.session.userId } });
        if (imagem) {
            req.session.userImage = `data:image/jpeg;base64,${imagem.toString('base64')}`;
        }
        res.redirect('/');
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).send('Erro ao atualizar perfil');
    }
});

module.exports = router;