const db = require('../../mongodb')
const getTopTweets = require('./../twitter')
const { credentials } = require('../../config')
const twitterOptions = {
    apiKey: credentials.authProviders.twitter.apiKey,
    apiSecret: credentials.authProviders.twitter.apiSecret
}

exports.getVacations = async (req, res) => {
    let vacations = await db.getVacations({ available: true })
    let context = {
        vacations: vacations.map(v => ({
            name: v.name,
            price: v.price,
            description: v.description,
            sku: v.sku
        }))
    }
    res.render('vacations', context)
}
exports.subscribe = async (req, res) => {
    let tweets = await getTopTweets(twitterOptions, '#oregon').getTweets()
    res.render('subscribe', {sku: req.query.sku, tweets: tweets})
}

exports.addSubscribe = async (req, res) => {
    let { email , sku } = req.body
    await db.subscribeToVacation({email, sku})
    res.redirect(303, '/vacations')
}