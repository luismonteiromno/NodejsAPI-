const users = require('../src/views/users_views');
const stores = require('../src/views/stores_views');
const products = require('../src/views/products_views');
const notifications = require('../src/views/notifications_views')
const express = require('express');
const app = express();

app.use(express.json());

const Routers = express.Router()

Routers.use('/users', users);
Routers.use('/stores', stores);
Routers.use('/products', products);
Routers.use('/notifications', notifications);


module.exports = Routers;