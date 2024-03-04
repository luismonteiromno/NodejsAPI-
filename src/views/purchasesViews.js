const Products = require('../../models/Products');
const Purchases = require('../../models/Purchases');
const Users = require('../../models/Users');
const Notifications = require('../../models/Notifications');
const Stores = require('../../models/Stores');
const sequelize = require('../../database/sequelize');
const express = require('express');
const app = express();
app.use(express.json());

sequelize.sync({force: false})
    .then(() => {
        console.log('Tabela Purchase sincronizada com o banco de dados.');
    })
    .catch((error) => {
        console.log('Erro ao sincronizar tabelas', error);
    });


const purchasesRouter = express.Router();

purchasesRouter.post('/register_purchase', async(req, res) => {
    try{
        const {userPurchase, storeId, products} = req.body;
        const user = await Users.findByPk(userPurchase);
        const products_existing = await Products.findAll({where: {id:products}}); 
        const store_existing = await Stores.findAll({where: {id:storeId}});
        if(!userPurchase){
            return res.status(400).json({'message': 'Preencha o campo de comprador corretamente!'});
        }else if(!user){
            return res.status(404).json({'message': 'Usuário não encontrado!'});
        }else if(products.length !== products_existing.length){
            return res.status(400).json({'message': 'Algum(uns) do(s) produto(s) não foi(ram) encontrado(s)!'});
        }else if(!storeId){
            return res.status(400).json({'message': 'Preencha o campo de loja corretamente!'});
        }else if(!store_existing){
            return res.status(404).json({'message': 'Loja não encontrada!'})
        }

        await Purchases.create({products: products, userPurchase: userPurchase, StoreId: storeId});
        products.forEach(async(purchase) => {
            const product = await Products.findAll({where: {id:purchase}});
            product.forEach(async(productName) => {
                const title = 'Nova compra realizada!'
                const message = `Produto ${productName.dataValues.name} comprado`
                await Notifications.create({
                    userId: userPurchase, 
                    title: title, 
                    message: message, 
                    notification_purchase: true, 
                    is_read: false
                });
            });
        });
        return res.status(200).json({'message': 'Compra realizada com sucesso'})
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao realizar compra!'})
    }
});

purchasesRouter.get('/list_purchases', async(req, res) => {
    try{
        const purchases = await Purchases.findAll();
        return res.status(200).json({'message': 'Compras encontradas', 'purchases': purchases});
    }catch(error){
        console.log(error)
    }
})

module.exports = purchasesRouter;