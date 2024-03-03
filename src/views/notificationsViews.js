const Notifications = require('../../models/Notifications');
const sequelize = require('../../database/sequelize');
const Users = require('../../models/Users');
const express = require('express');
const app = express();
app.use(express.json());

const notificationsRouter = express.Router();
sequelize.sync({force: false})
    .then(() => {
        console.log('Tabela Notifications sincronizadas com o banco de dados.');
    })
    .catch((error) => {
        console.log('Erro ao sincronizar tabelas', error);
    });

notificationsRouter.get('/all_notifications', async(req, res) => {
    try{
        const notifications = await Notifications.findAll();
        return res.status(200).json({'message': 'Notificações encontradas', 'products': notifications});
    }catch(error){
        console.log(`error ${error}`)
        return res.status(500).json({'message': 'Erro ao listar notificações!'})
    }
});

notificationsRouter.post('/send_notification', async(req, res) => {
    try{
        const {title, message, user_id, notification_purchase, is_read} = req.body;
        const user = await Users.findAll({where: {id:user_id}});
        if(!user || user.length !== user_id){
            return res.status(404).json({'message': 'Usuário não encontrado'});
        }
        await Notifications.create({title, message, userId: user_id, notification_purchase, is_read});
        return res.status(200).json({'message': 'Notificação enviada com sucesso'})
    }catch(error){
        console.log(error)
        return res.status(500).json({'message': 'Erro ao enviar notificação!'});
    }
});

notificationsRouter.get('/notification_id/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const notification = await Notifications.findByPk(id)
        return res.status(200).json({'message': 'Notificação encontrada', 'notification': notification});
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao buscar notificação'});
    }
});

notificationsRouter.put('/read_notification/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const {is_read} = req.body;
        const notification = await Notifications.findByPk(id)
        if(!notification){
            return res.status(404).json({'message': 'Notificação não encontrada!'})
        }
        if(notification.is_read === true){
            return res.status(200).json({'message': 'Essa notificação já foi lida'});
        }
        notification.is_read = is_read;
        await notification.save()
        return res.status(200).json({'message': 'Notificação lida com sucesso'})
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao ler notificação'});
    }
});

notificationsRouter.get('/notifications_of_purchase', async(req, res) => {
    try{
        const notifications = await Notifications.findAll({where: {notification_purchase: true}});
        return res.status(200).json({'message': 'Notificações encontradas', 'notifications': notifications});
    }catch(error){
        console.log(error);
        return res.status(500).json({'message': 'Erro ao listar notificações de compras'});
    }
})

module.exports = notificationsRouter;
