const {DataTypes} = require('sequelize');
const sequelize = require('../database/sequelize');
const User = require('./Users');

const Notifications = sequelize.define('Notifications', {
    title: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    message: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    notification_purchase: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
})

Notifications.belongsTo(User, {
    foreignKey: {
        name: 'user_id',
        allowNull: false,
        type: DataTypes.INTEGER
    }
})

module.exports = Notifications;
