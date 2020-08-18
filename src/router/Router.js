const express = require('express')
const router = new express.Router()
const bodyParser = require('body-parser')
const Chatroom = require('../models/chatroom')

const { randomNumber } = require('../utils/misc')
const { user, clients } = require('../../db.json');
const User = user;
const Clients = clients;

const Messages = require('../models/messages')
const jsonParser = bodyParser.json()

router.post('/chatroom', jsonParser, async (req, res)=>{
    try {
        const { userId, clientId } = req.body;
        let find = null;
        find = await Chatroom.findOne({ userId, clientId }).exec();
        if(find===null){
            find = await Chatroom.findOne({ userId: clientId, clientId: userId }).exec();
        } 
        if(find===null){
            const data = {
                id: randomNumber(2000, 3000),
                userId,
                clientId,
                conversationId: randomNumber(3000,4000)
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
        const find = await Messages.find({ chatroomId: id }).exec();
        res.status(200).send(find)
        
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})
router.post('/messages', jsonParser, async (req, res)=>{
    try {
        const payload = (req.body);
        const messages = new Messages({
            ...payload
        });
        await messages.save() 
        const find = await Messages.find({ chatroomId: payload.chatroomId }).exec();
        res.status(200).send(find)
        
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