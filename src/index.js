const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
require('./db/mongoose')
const Router = require('./router/Router')
const Messages = require('./models/messages')
const MessagesArray = require('./models/messageArray')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
app.use(Router)


io.on('connection', (socket) => {
    socket.on('join', (options, callback) => {
        const { chatroom } = options;

        socket.join(chatroom)
        callback()
    })
 
    socket.on('sendMessage', async (data, callback) => {
        try {
            const { userId, content, chatroom, createdAt } = data;
            const find = await MessagesArray.findOne({chatroomId: chatroom, $where: 'this.content.length<20'})
            if(find===null){
                const messages = new MessagesArray({
                    chatroomId: chatroom,
                    content: [
                        {
                            userId,
                            content,
                            createdAt,
                            isSent: true
                        }
                    ]
                });
                await messages.save()
            } else {
                await MessagesArray.collection.update({
                    "_id": find._id
                }, {
                    $push: {
                    "content": data
                    }
                })
            }
            io.to(chatroom).emit('message', data)
            callback() 
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('disconnect', async (reason) => {
        console.log(reason)
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})