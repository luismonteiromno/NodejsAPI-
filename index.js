const express = require('express');
const routers =  require('./routes/routers');
const sequelize = require('./database/sequelize');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', async(req, res) => {
    res.send('Olá, mundo!');
});

app.use('/api', routers);


app.listen(port);
