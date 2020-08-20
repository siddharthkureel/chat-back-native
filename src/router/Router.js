const express = require('express')
const router = new express.Router()
const bodyParser = require('body-parser')
const Chatroom = require('../models/chatroom')

const { randomNumber } = require('../utils/misc')
const { user, clients } = require('../../db.json');
const User = user;
const Clients = clients;

const MessagesArray = require('../models/messageArray')
const jsonParser = bodyParser.json()

router.post('/chatroom', jsonParser, async (req, res)=>{
    try {
        const { userId, clientId } = req.body;
        let find = null;
        find = await Chatroom.findOne({ userId, clientId }).exec();
        if(find===null){
            const data = {
                userId,
                clientId
            }
            const chatroom = new Chatroom({
                ...data
            })
            await chatroom.save()
            res.status(201).send(chatroom)
        }else{
            res.status(200).send(find);
        }
    } catch (e) {
        res.status(400).send(e)
    }
})
router.get('/messages/:id', async (req, res)=>{
    try {
        const id = (req.params.id) 
        const find = await MessagesArray.find({ chatroomId: id }).exec();
        const content = find.map(element => element.content)
        const flat = content.flat(1)
        res.status(200).send(flat)
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/user',jsonParser, (req, res)=>{
    const { username, password } = req.body;
    User.forEach(user=>{
        if(user.username===username && user.password===password){
            const id = user.id;
            let userClients; 
            if(user.type==='client'){
                userClients = User.filter(item=>item.id===user.partnerId);
            } else {
                userClients = Clients.filter(client=>client.userId===id)
            }
            return res.send({
               user,
               userClients 
            })
        }
    })
})

module.exports = router