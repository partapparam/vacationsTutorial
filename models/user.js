const mongoose = require('mongoose')
const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: String,
    created: Date
})
const User = mongoose.model('User', usersSchema)
module.exports = User