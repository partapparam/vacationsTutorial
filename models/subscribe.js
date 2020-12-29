const mongoose = require('mongoose')
const subscribesSchema = new mongoose.Schema({
    email: String,
    skus: [String]
})
const Subscribe = mongoose.model('Subscribe', subscribesSchema)
module.exports = Subscribe