const { DataTypes } = require('sequelize');
const User = require('./Users');
const sequelize = require('../database/sequelize');

const Stores = sequelize.define('Stores', {
    logo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    owners: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
    },
    employees: {
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
        defaultValue: false,
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

Stores.hasMany(User, {});

module.exports = Stores;
