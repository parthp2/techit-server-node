'use strict'
const mongoose = require('mongoose')
let userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    },
    phone: String,
    post: {
        type: String,
        uppercase: true,
        enum: ['SYS_ADMIN', 'SUPERVISING_TECHNICIAN', 'TECHNICIAN', 'USER'],
        default: 'USER'
    },
    department: String,
    ticketsAssigned: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ticket'
        }],
        select: false
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Unit',
        default: null
    }
},
{
    versionKey: false,
    toJSON:{
        transform: function (doc, ret) {
            delete ret.hash
        }
    }
})
module.exports = mongoose.model('User', userSchema);