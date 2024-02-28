const Products = require('../../models/Products');
const Stores = require('../../models/Stores');
const sequelize = require('../../database/sequelize');
const express = require('express');
const app = express();
app.use(express.json());

sequelize.sync({force: false})
    .then(() => {
        console.log('Tabela Products sincronizada com o banco de dados.');
    })
    .catch((error) => {
        console.log('Erro ao sincronizar tabelas', error);
    });


const productsRouter = express.Router();

productsRouter.get('/all_products', async(req, res) => {
    try{
        const products = await Products.findAll();
        res.status(200).json({'message': 'Sucesso', 'products': products});
    }catch(error){
        console.log(`error ${error}`)
        res.status(500).json({'message': 'Erro ao listar produtos!'})
    }
});

productsRouter.post('/register_product', async(req, res) => {
    try{
        const {name, stores, price, in_stock} = req.body;
        const existingStore = await Stores.findAll({where: {id:stores}});
        if(stores.length !== existingStore.length){
            return res.status(404).json({'message': 'Alguma(s) loja(s) não foi(ram) encontrada(s)!'})
        }
        await Products.create({name, stores, price, in_stock});
        res.status(200).json({'message': 'Produto registrado com sucesso'})
    }catch(error){
        console.log(error)
        res.status(500).json({'message': 'Erro ao registrar produto!'})
    }
});

module.exports = productsRouter;
