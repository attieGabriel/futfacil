require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const quadraRoutes = require('./routes/quadraRoutes');
const donoRoutes = require('./routes/donoRoutes');
const sequelize = require('./config/database');

const app = express();

// Configuração do EJS
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração da sessão
app.use(session({
    secret: 'seuSegredoAqui',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Use secure: true em produção com HTTPS
}));

// Middleware para definir isAuthenticated e userImage em todas as respostas
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.userImage = req.session.userImage || '/images/profile-icon.jpg';
    next();
});

// Sincronizar o banco de dados
sequelize.sync()
    .then(() => console.log("✅ Tabelas sincronizadas com PostgreSQL"))
    .catch(err => console.error("❌ Erro ao sincronizar tabelas:", err));

// Rotas
app.use('/', quadraRoutes);
app.use('/', donoRoutes); // Isso fará com que as rotas de dono estejam disponíveis diretamente

// Rota principal
app.get('/', (req, res) => {
    res.render('index');
});

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));