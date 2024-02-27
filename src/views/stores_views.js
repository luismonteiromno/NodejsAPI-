const User = require('../../models/users');
const Stores = require('../../models/stores');
const sequelize = require('../../database/sequelize');
const express = require('express');
const app = express();

app.use(express.json());
const storesRouter = express.Router()

sequelize.sync({force: false})
    .then(() => {
        console.log('Tabelas sincronizadas com o banco de dados.');
    })
    .catch((error) => {
        console.log('Erro ao sincronizar tabelas', error);
    });

storesRouter.get('/stores', async(req, res) => {
    try{
        const stores = await Stores.findAll();
        return res.status(200).json({'message': 'Lojas encontradas', 'stores': stores})
    }catch(error){
        console.log('Error ao listar lojas"', error);
        return res.status(500).json({'message': 'Error ao listar lojas!'})
    }
});

storesRouter.get('/store/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const store = await Stores.findByPk(id);
        if(!store){
            return res.status(404).json({'message': 'Loja não encontrada!'})
        }
        return res.status(200).json({'message': 'Loja encontrada', 'store': store})
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao buscar loja!'})
    }
});

storesRouter.post('/register_store', async(req, res) => {
    try{
        const { name, owners, phone, street, number, delivery, minimum_delivery, maximum_delivery } = req.body;
        const existingUsers = await User.findAll({ where: { id: owners } });

        if (!owners || owners.length === 0) {
            return res.status(400).json({ 'message': 'Atributo "owners" é obrigatório' });
        }

        if (owners.length !== existingUsers.length) {
            return res.status(404).json({ 'message': 'Um ou mais usuários não foram encontrados' });
        }

        await Stores.create({ name, owners, phone, street, number, delivery, minimum_delivery, maximum_delivery });
        return res.status(200).json({'message': 'Loja criada com sucesso'})
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao criar loja!'});
    }
});

storesRouter.delete('/exclude_store', async(req, res) => {
    try{
        const {store_id} = req.body;
        const store = await Stores.findByPk(store_id);
        if(!store){
            return res.status(404).json({'message': 'Loja não encontrada!'})
        }
        await store.destroy()
        res.status(200).json({'message': 'Loja deletada com sucesso'})
    }catch(error){
        console.log(error);
    }
});

module.exports = storesRouter;
