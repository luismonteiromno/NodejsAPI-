const users = require('../src/views/usersViews');
const stores = require('../src/views/storesViews');
const products = require('../src/views/productsViews');
const notifications = require('../src/views/notificationsViews');
const purchases = require('../src/views/purchasesViews');
const express = require('express');
const app = express();

app.use(express.json());

const Routers = express.Router()

Routers.use('/users', users);
Routers.use('/stores', stores);
Routers.use('/products', products);
Routers.use('/notifications', notifications);
Routers.use('/purchases', purchases);

module.exports = Routers;