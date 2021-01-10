const express = require('express')
const router = new express.Router()
const bodyParser = require('body-parser')
const compose = require('compose-middleware').compose
const Chatroom = require('../models/chatroom')
const requireAuth = require('../middlewares/requireAuth');


const jsonParser = bodyParser.json()
router.use(compose([jsonParser, requireAuth]));

router.post('/request', async (req, res)=>{
    try {
        const data = req.body;
        const { email, name } = req.user;
        const currentUser = {
            email, name
        }

        const chatroom = new Chatroom({
            users: [],
            status: 'pending'
        })
        chatroom.users.push(currentUser)
        chatroom.users.push(data)
        await chatroom.save()
        res.status(201)
       
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/declined/:id', async (req, res)=>{
    try {
        const { id } = req.params
        await Chatroom.updateOne({
            "_id": id
        }, {
            $set: {
                "status": "declined"
            }
        }) 
        res.status(201)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/accepted/:id', async (req, res)=>{
    try {
        const { id } = req.params
        await Chatroom.updateOne({
            "_id": id
        }, {
            $set: {
                "status": "accepted"
            }
        }) 
        res.status(201).send('accepted')
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router