const Products = require('../../models/Products');
const sequelize = require('../../database/sequelize');
const Stores = require('../../models/Stores');
const express = require('express');
const { where } = require('sequelize');
const app = express();
app.use(express.json());


const productsRouter = express.Router();
sequelize.sync({force: false})
    .then(() => {
        console.log('Tabela Products sincronizadas com o banco de dados.');
    })
    .catch((error) => {
        console.log('Erro ao sincronizar tabelas', error);
    });

productsRouter.get('/all_products', async(req, res) => {
    try{
        const products = await Products.findAll();
        return res.status(200).json({'message': 'Sucesso', 'products': products});
    }catch(error){
        console.log(`error ${error}`)
        return res.status(500).json({'message': 'Erro ao listar produtos!'})
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
        return res.status(200).json({'message': 'Produto registrado com sucesso'})
    }catch(error){
        console.log(error)
        return res.status(500).json({'message': 'Erro ao registrar produto!'})
    }
});

productsRouter.patch('/update_product/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const {name, stores, price} = req.body;
        const product = await Products.findByPk(id);
        const store = await Stores.findAll({where: {id:stores}});
        if(stores.length !== store.length){
            return res.status(404).json({'message': 'Alguma(s) loja(s) não foi(ram) encontrada(s)!'});
        }
        product.name = name;
        product.stores = stores;
        product.price = price;
        await product.save();
        return res.status(200).json({'message': 'Produto atualizado com sucesso'})
    }catch(error){
        console.log(error)
        return res.status(500).json({'message': 'Erro ao atualizar produto!'})
    }
});

productsRouter.get('/products_in_stock', async(req, res) => {
    try{
        const products = await Products.findAll({where: {in_stock:true}});
        return res.status(200).json({'message': 'Produtos em estoque', 'products': products});
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao listar produtos!'})
    }
})

module.exports = productsRouter;
