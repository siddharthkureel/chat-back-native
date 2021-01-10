const express = require('express')
const bodyParser = require('body-parser')
const Chatroom = require('../models/chatroom')
const compose = require('compose-middleware').compose
const User = require('../models/user')
const requireAuth = require('../middlewares/requireAuth');

const jsonParser = bodyParser.json()
const router = new express.Router()
router.use(compose([jsonParser, requireAuth]));

router.get('/friends', async (req, res)=>{
    try {
        const { email } = (req.user);
        const find = await Chatroom.find({ 
            users: { 
                $elemMatch: { email }
            },
            status: 'accepted'
        }).exec();
        res.status(200).send(find);
        
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/friend-request', async (req, res)=>{
    try {
        const { email } = req.user;
        const find = await Chatroom.find({ 
            users: { 
                $elemMatch: { email },
            },
            status: 'pending'
        }).exec();
        res.status(200).send(find);
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/search/:query', async (req, res)=>{
    try {
        const { query } = req.params;
        const { email: currentUser } = req.user;
        const find = await User.findOne({ email: query }).exec();
        if(find){
            const chatroom = await Chatroom.find({
                "$and":[
                    {
                        "users.email": currentUser
                    },
                    {
                        "users.email": query
                    }
                ]
            })
            const { email, name } = find;
            if(chatroom.length>0){
                res.status(200).send({
                    name, email, chatroom
                });
            } else {
                res.status(200).send({
                    name, email
                });
            }
        } else {
            res.status(200).send('No user found');
        } 
        
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router