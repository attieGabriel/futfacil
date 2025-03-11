const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Dono = sequelize.define('Dono', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imagem: {
        type: DataTypes.BLOB('long'), // Armazena a imagem como blob
        allowNull: true
    }
}, {
    tableName: 'donos',
    timestamps: false
});

module.exports = Dono;