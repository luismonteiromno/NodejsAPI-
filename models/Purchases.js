const {DataTypes} = require('sequelize');
const Products = require('./Products');
const User = require('./Users');
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

Purchases.hasMany(Products, {})

module.exports = Purchases;
