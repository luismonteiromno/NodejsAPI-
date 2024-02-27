const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    cpf: {
        type: DataTypes.STRING(13),
        allowNull: false,
        unique: true
    }
});

module.exports = User;
