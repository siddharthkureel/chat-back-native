const express = require('express')
const router = new express.Router()
const bodyParser = require('body-parser')

const Chatroom = require('../models/chatroom')
const User = require('../models/user');
const MessagesArray = require('../models/messageArray')
const jsonParser = bodyParser.json()

router.post('/chatroom', jsonParser, async (req, res)=>{
    try {
        const { userA, userB } = req.body;
        let find = null;
        find = await Chatroom.findOne({ userA, userB }).exec();
        if(find===null){
            try {
                const chatroom = new Chatroom({
                    userA,
                    userB
                })
                await chatroom.save()
                res.status(201).send(chatroom)
            } catch (error) {
                console.log(error)
            }
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

router.post('/clients', jsonParser, async (req, res)=>{
    try {
        const { id, type, partnerId } = (req.body)
        if(type==='client'){
            const partner = await User.findOne({ _id: partnerId }).exec();
            const array = [];
            array.push(partner)
            res.status(200).send(array)
        }
        if(type==='partner'){
            const clients = await User.find({ partnerId: id }).exec();
            res.status(200).send(clients)
        }
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.post('/signin', jsonParser, async(req, res)=>{
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        res.status(200).send(user)
    } catch (error) {
        res.status(200).send(error)
    }
})

router.post('/signup', jsonParser, async(req, res)=>{
    const data = req.body;
    try {
        if(data.type==='client'){
            const user = await User.findOne({ username: data.partner });
            data.partnerId = user._id
        }
        const user = new User({
            ...data,
            active: true,
            lastSeen: '',
        })
        await user.save()
        res.status(201).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
    
})

module.exports = router