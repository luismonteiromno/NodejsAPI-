const users = require('./src/views/users_views');
const stores = require('./src/views/stores_views');
const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', async(req, res) => {
    res.send('Olá, mundo!');
});
app.use('/users', users);
app.use('/stores', stores);

app.listen(port)
