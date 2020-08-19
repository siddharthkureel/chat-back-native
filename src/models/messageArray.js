const mongoose = require('mongoose')
const { ObjectID } = require('mongodb')

const messagesSchema = new mongoose.Schema({
    chatroomId: {
        type: ObjectID,
        required: true,
        trim: true
    },
    content: {
        type: Array,
    },
},{
    timestamps: true
})
 
const MessagesArray = mongoose.model('MessagesArray', messagesSchema)

module.exports = MessagesArray