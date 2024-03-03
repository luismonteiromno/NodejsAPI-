const {DataTypes} = require('sequelize');
const Products = require('./Products');
const User = require('./Users');
const Stores = require('./Stores');
const sequelize = require('../database/sequelize');

const Purchases = sequelize.define('Purchases', {
    products: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
    }
})

Purchases.belongsTo(User, {
    foreignKey: {
        name: 'userPurchase',
        allowNull: false,
        type: DataTypes.INTEGER
    }
});

Purchases.belongsTo(Stores, {
    name: 'storeId',
    type: DataTypes.INTEGER,
    allowNull: false
})

Purchases.hasMany(Products, {})

module.exports = Purchases;
