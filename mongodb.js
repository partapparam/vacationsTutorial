const mongoose = require('mongoose')
const { credentials } = require('./config')
const { connectionString } = credentials.mongo
const Vacation = require('./models/vacation')
const User = require('./models/user')
const Subscribe = require('./models/subscribe')
if (!connectionString) {
    console.log('No connection string')
    process.exit(1)
}

mongoose.connect(connectionString, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', (err) => {
    console.log(err, 'mongodb 12')
    process.exit(1)
})
db.once('open', () => {
    console.log('Mongodb is up')
})

//Database api
module.exports = {
    getVacations: async (options = {}) => Vacation.find(options),
    subscribeToVacation: async ({ email, sku }) => {
        await Subscribe.updateOne(
            { email },
            { $push: {skus: sku} },
            { upsert: true }
        )
    },
    getUserById: async (id) => User.findById(id),
    getUserByAuthId: async (authId) => User.findOne({authId}),
    addUser: async (data) => new User(data).save(),
    addLocationData: async (sku, data) => {
        await Vacation.updateOne({ sku }, data)
    },
    close: () => db.close()
}

Vacation.find({}, (err, vacations) => {
    if (vacations.length) return console.log('vacations exists, no need to seed')
    if (err) return console.log('Error on mongodo 43')

    new Vacation({
        name: 'Hood River',
        sku: 'HR199',
        price: 199,
        inSeason: true,
        description: 'This is the hood River vacation package',
        available: true,
        location: {
            search: 'Hood River, OR'
        }
    }).save()

    new Vacation({
        name: 'Crater Lake',
        sku: 'CL599',
        price: 599,
        inSeason: true,
        description: 'This is the Crater Lake vacation package',
        available: true,
        location: {
            search: 'Crater Lake, OR'
        }
    }).save()
})