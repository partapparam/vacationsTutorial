const mongoose = require('mongoose')
const vacationsSchema = new mongoose.Schema({
    price: Number,
    location: {
        search: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    sku: String,
    name: String,
    inSeason: Boolean,
    description: String,
    available: Boolean
})
const Vacation = mongoose.model('Vacation', vacationsSchema)
module.exports = Vacation