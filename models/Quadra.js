const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Dono = require('./Dono'); // Certifique-se de que o caminho para o modelo Usuario está correto

const quadra = sequelize.define('quadra', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT
    },
    localizacao: {
        type: DataTypes.TEXT
    },
    preco: {
        type: DataTypes.FLOAT
    },
    imagem: {
        type: DataTypes.STRING
    },
    funcionamento: {
        type: DataTypes.STRING
    },
    telefone: {
        type: DataTypes.STRING
    },
    donos_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Dono,
            key: 'id'
        }
    }
}, {
    tableName: 'quadras',
    timestamps: false
});

module.exports = quadra;