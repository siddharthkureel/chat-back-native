const mongoose = require('mongoose')
const { ObjectID } = require('mongodb')

const chatroomSchema = new mongoose.Schema({
    userA: {
        type: ObjectID,
        required: true,
        trim: true
    },
    userB: {
        type: ObjectID,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Chatroom = mongoose.model('Chatroom', chatroomSchema)

module.exports = Chatroom