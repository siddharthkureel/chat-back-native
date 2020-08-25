const mongoose = require('mongoose')
const { ObjectID } = require('mongodb')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        required: true,
        trim: true
    },
    partnerId: {
        type: ObjectID,
        default: null,
        trim: true
    },
    active: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date
    },
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

module.exports = User