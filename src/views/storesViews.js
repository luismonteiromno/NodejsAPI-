const User = require('../../models/Users');
const Stores = require('../../models/Stores');
const sequelize = require('../../database/sequelize');
const express = require('express');
const app = express();

app.use(express.json());
const storesRouter = express.Router()
sequelize.sync({force: false})
    .then(() => {
        console.log('Tabela Stores sincronizadas com o banco de dados.');
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
        const {logo, name, owners, employees, phone, street, number, delivery, minimum_delivery, maximum_delivery} = req.body;        
        const existingUsers = await User.findAll({ where: { id: owners } });
        
        existingUsers.forEach(owner => {
            if(owner.dataValues.role !== 'owner'){
                return res.status(400).json({'message': 'Algum(s) usuário(s) não é/são dono(s)'})
            }
        });
        employees.forEach(async(employee) => {
            const existingEmployees = await User.findAll({where: {id:employee}});
            existingEmployees.forEach(validateEmployee => {
                if(validateEmployee.dataValues.role !== 'employee'){
                    return res.status(400).json({'message': 'Algum(s) usuário(s) não é/são funcionário(s)'})
                }
            });    
        });

        if (!owners || owners.length === 0) {
            return res.status(400).json({ 'message': 'Atributo "owners" é obrigatório' });
        }
        if (owners.length !== existingUsers.length) {
            return res.status(404).json({ 'message': 'Um ou mais usuários não foram encontrados' });
        }
        if(delivery === true && (minimum_delivery === null || maximum_delivery === null || minimum_delivery === 0 || maximum_delivery === 0)
        ){
            res.status(400).json({'message': 'Preencha os campos de tempo de entrega corretamente!'})
        }
        if(delivery === false && (minimum_delivery !== null || maximum_delivery !== null || minimum_delivery !== 0 || maximum_delivery !== 0)
        ){
            res.status(400).json({'message': 'Preencha o campo de Delivery para validar os campos de tempo de entrega'})
        }
        await Stores.create({
            logo: logo,
            name: name, 
            owners: owners, 
            employees: employees, 
            phone: phone, 
            street: street, 
            number: number, 
            delivery: delivery, 
            minimum_delivery: minimum_delivery, 
            maximum_delivery: maximum_delivery 
        });
        return res.status(200).json({'message': 'Loja criada com sucesso'})
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao criar loja!'});
    }
});

storesRouter.patch('/update_store/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const {name, owners, employees, phone, street, number, delivery, minimum_delivery, maximum_delivery} = req.body;
        const store = await Stores.findByPk(id);
        if(!store){
            res.status(404).json({'message': 'Loja não encontrada!'});
        }
        if(owners.length !== store.owners.length){
            const owner = await User.findAll({where: {id:owners}});
            if(!owner || owner.length !== owners.length){
                res.status(400).json    ({'message': 'Algum(ns) dono(s) não foi(ram) encontrado(s)'});
            }
        }else if(employees.length !== store.employees.length){
            const employee = await User.findAll({where: {id:employees}});
            if(!employee || employee.length !== employee.length){
                res.status(400).json    ({'message': 'Algum(ns) funcionário(s) não foi(ram) encontrado(s)'});
            }
        }
        
        if(delivery === true && (minimum_delivery === null || maximum_delivery === null || minimum_delivery === 0 || maximum_delivery === 0)
        ){
            res.status(400).json({'message': 'Preencha os campos de tempo de entrega corretamente!'})
        }
        if(delivery === false && (minimum_delivery !== null || maximum_delivery !== null || minimum_delivery !== 0 || maximum_delivery !== 0)
        ){
            res.status(400).json({'message': 'Preencha o campo de Delivery para validar os campos de tempo de entrega'})
        }
        await store.update({
            name: name, 
            owners: owners, 
            employees: employees,
            phone: phone, 
            street: street,
            number: number, 
            delivery: delivery, 
            minimum_delivery: minimum_delivery, 
            maximum_delivery: maximum_delivery
        })
        return res.status(200).json({'message': 'Loja atualizada com sucesso'})
    }catch(error){
        console.log(error)
        return res.status(500).json({'message': 'Erro ao atualizar loja!'})
    }
})

storesRouter.delete('/exclude_store', async(req, res) => {
    try{
        const {store_id} = req.body;
        const store = await Stores.findByPk(store_id);
        if(!store){
            return res.status(404).json({'message': 'Loja não encontrada!'})
        }
        await store.destroy()
        return res.status(200).json({'message': 'Loja deletada com sucesso'})
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao excluir loja!'})
    }
});

module.exports = storesRouter;
