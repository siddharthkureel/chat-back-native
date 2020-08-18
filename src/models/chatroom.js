const mongoose = require('mongoose')

const chatroomSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true,
        trim: true
    },
    clientId: {
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Chatroom = mongoose.model('Chatroom', chatroomSchema)

module.exports = Chatroom