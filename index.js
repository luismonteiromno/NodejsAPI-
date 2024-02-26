const users = require('./views/users_views');
const stores = require('./views/stores_views');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', users);
app.use('/stores', stores);

app.listen(port)
