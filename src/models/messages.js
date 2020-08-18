const mongoose = require('mongoose')
const { ObjectID } = require('mongodb')

const messagesSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    isSent: {
        type: Boolean,
        required: true,
        default: false
    },
    chatroomId: {
        type: ObjectID,
        required: true,
        trim: true
    },
    userId:{
        type: Number,
        required: true,
        trim: true
    }
}, {
    timestamps: true
})

const Messages = mongoose.model('Messages', messagesSchema)

module.exports = Messages