const express = require('express')
const router = new express.Router()
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const compose = require('compose-middleware').compose

const User = require('../models/user')
const jsonParser = bodyParser.json()
const requireAuth = require('../middlewares/requireAuth')

router.post('/signin', jsonParser, async(req, res)=>{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
    try {
        await user.comparePassword(password);
        delete user.password
        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        res.send({
            ...user._doc,
            token
        });
    } catch (err) {
        return res.status(422).send({ error: 'Invalid password or email' });
    }
})

router.post('/signup', jsonParser, async(req, res)=>{
    const data = req.body;
    try {
        const user = new User({
            ...data,
            active: true,
            lastSeen: '',
        })
        await user.save();

        const token = jwt.sign({ userId: user._id }, 'MY_SECRET_KEY');
        res.status(201).send({
            ...user._doc,
            token
        })

    } catch (error) {
        res.status(500).send(error)
    }
    
})

router.get('/user', compose([jsonParser, requireAuth]), async(req, res)=>{
    try {
        res.send(req.user)
    } catch (e){
        console.log(e)
    }
})

module.exports = router