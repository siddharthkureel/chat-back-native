const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
require('./db/mongoose')
const Router = require('./router/Router')
const Messages = require('./models/messages')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

app.use(Router)

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('join', (options, callback) => {
        const { chatroom } = options;

        socket.join(chatroom)
        callback()
    })

    socket.on('sendMessage', async (data, callback) => {
        const { userId, content, chatroom } = data;
        const messages = new Messages({
            userId, 
            content, 
            chatroomId: chatroom,
            isSent: true
        });
        await messages.save() 
        
        io.to(chatroom).emit('message', { userId, content, chatroom })
        callback()
    })
 

    // socket.on('disconnect', () => {
    // })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})