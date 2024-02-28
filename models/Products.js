const {DataTypes} = require('sequelize');
const Stores = require('./Stores');
const sequelize = require('../database/sequelize');

const Products = sequelize.define('Products', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stores: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    in_stock: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    }
});

const ProductsStore = sequelize.define('ProductsStore', {});

Products.belongsToMany(Stores, {through: ProductsStore});
Stores.belongsToMany(Products, {through: ProductsStore});


module.exports = Products;
