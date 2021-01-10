const express = require('express');
const bodyParser = require('body-parser');
const compose = require('compose-middleware').compose

const MessagesArray = require('../models/messageArray');
const requireAuth = require('../middlewares/requireAuth');

const router = new express.Router();
const jsonParser = bodyParser.json();
router.use(compose([jsonParser, requireAuth]));

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

module.exports = router