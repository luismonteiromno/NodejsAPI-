const { DataTypes } = require('sequelize');
const User = require('./users');
const sequelize = require('../database/sequelize');

const Stores = sequelize.define('Stores', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owners: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }, 
    street: {
        type: DataTypes.STRING,
        allowNull: false
    },
    number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    delivery: {
        type: DataTypes.BOOLEAN,
        default: false,
    },
    minimum_delivery: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    maximum_delivery: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
});

const OwnersStores = sequelize.define('OwnersStores', {});

Stores.belongsToMany(User, {through: OwnersStores});
User.belongsToMany(Stores, {through: OwnersStores});

module.exports = Stores;
