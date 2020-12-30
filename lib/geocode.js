const https = require('https')
const { credentials } = require('../config')

module.exports = async query => {
    let options = {
        hostname: 'maps.googleapis.com',
        path: '/maps/api/geocode/json?address=' + encodeURIComponent(query) + '&key=' + credentials.authProviders.google.apiKey
    }

    return new Promise((resolve, reject) => {
        https.request(options, res => {
            let data = ''
            res.on('data', chunk => data += chunk)
            res.on('end', () => {
                data = JSON.parse(data)
                if (!data.results.length) return reject(new Error('Geocode Error'))
                return resolve(data.results[0].geometry.location)
            })
        }).end()
    })
}