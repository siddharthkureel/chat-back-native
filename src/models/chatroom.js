const mongoose = require('mongoose')
const { ObjectID } = require('mongodb')

const chatroomSchema = new mongoose.Schema({
    users: [{
        name: String,
        email: String,
        id: ObjectID
    }],
    status: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Chatroom = mongoose.model('Chatroom', chatroomSchema)

module.exports = Chatroom