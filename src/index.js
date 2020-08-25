const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const cors = require('cors')
require('./db/mongoose')
const Router = require('./router/Router')
const User = require('./models/user');
const MessagesArray = require('./models/messageArray')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000
app.use(Router)


io.on('connect', (socket) => {
    let user;

    socket.on('active', async ({ userId }, callback)=>{
        user = userId;
        try {
            await User.updateOne({
                "_id": userId
            }, {
                $set: {
                    "active": true,
                }
            })
            callback()
        } catch (error) {
            console.log(error)
        }
    })
    socket.on('join', (options, callback) => {
        const { chatroom } = options;
        socket.join(chatroom)
        callback()
    })
    
    socket.on('sendMessage', async (data, callback) => {
        try {
            const { userId, content, chatroom, createdAt } = data;
            const find = await MessagesArray.findOne({ chatroomId: chatroom, $where: 'this.content.length<100' })
            if(find === null){
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
                await messages.save();
            } else {
                await MessagesArray.collection.updateOne({
                    "_id": find._id
                }, {
                    $push: {
                    "content": data
                    }
                })
            }
            io.to(chatroom).emit('message', data);
            callback();
        } catch (error) {
            console.log(error);
        }
    })

    socket.on('disconnect', async () => {
        try {
            await User.updateOne({
                "_id": user
            }, {
                $set: {
                    "active": false,
                    "lastSeen": new Date()
                }
            })
        } catch (error) {
            console.log(error);
        }
    })
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
})