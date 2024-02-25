const User = require('./models/users')
const sequelize = require('./database/sequelize');
const express = require('express');
const app = express();
const port = 3000; 
app.use(express.json());

// sincronizar os modelos com o banco de dados não é obrigatória, mas é uma prática comum ao utilizar o Sequelize.
sequelize.sync({force: false})
    .then(() => {
        console.log('Tabelas sincronizadas com o banco de dados.');
    })
    .catch((error) => {
        console.log('Erro ao sincronizar tabelas', error);
    });

// const users = {
//     "users": [{
//         'id': 1,
//         'name': 'Luis Felipe',
//     },
//     {
//         'id': 2,
//         'name': 'Isaque'
//     },
//     {
//         'id': 3,
//         'name': 'Italo'
//     },
//     {
//         'id': 4,
//         'name': 'Welison'
//     },
//     {
//         'id': 5,
//         'name': 'Paulo'
//     },
//     {
//         'id': 6,
//         'name': 'Widley'
//     }
// ]
// }

app.get('/', async(req, res) => {
    res.send('Olá, mundo!');
});

app.get('/users', async(req, res) => {
    try{
        const users = await User.findAll();
        res.status(200).json({'message': 'Usuários encontrados', 'users': users});
    }catch(error){
        console.log('Erro ao listar usuários!', error);
        res.status(500).json({'message': 'Erro ao listar usuários'});
    }
});

app.post('/register_user', async(req, res) => {
    try{
        const { username, email } = req.body;
        await User.create({username, email});
        res.status(200).json({'message': 'Usuário cadastrado com sucesso'});
        }catch(error){
            console.log('Erro ao cadastrar usuário!', error);
            res.status(500).json({'message': 'Erro ao cadastrar usuário!'});
        }
})

app.patch('/update_user/:id', async(req, res) => {
    try{
        const {id} = req.params;
        const {username, email} = req.body;
        const user = await User.findByPk(id);
        if(!user){
            res.status(404).json({'message': 'Usuário não encontrado!'});
        }

        if(user.email !== email){
            const user_existing = await User.findOne({where:{email}});
            if(user_existing){
                return res.status(409).json({ 'message': 'Este email já está sendo utilizado!' });
            }
        }
        await user.update({username, email});

        res.status(200).json({'message': 'Usuário atualizado com sucesso'});
            
    }catch(error){
        console.log('error', error);
        res.status(500).json({'message': 'Erro ao atualizar usuário!'});
    }
})
// users.users.forEach(user => {
//     console.log(user.id);
// });

app.get('/user/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (user) {
            return res.json({'user': user});
        } else {
            return res.status(404).json({'Message': 'Usuário não encontrado'});
        }
    } catch(error) {
        console.log(error)
        return res.status(500).json({'Message': 'Erro ao listar usuário!'});
    }
})

// app.listen(port, () => {
//     console.log(`Servidor rodando em http://localhost:${port}`);
// });

app.listen(port)
