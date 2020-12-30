const https = require('https')
const qs = require('querystringify')

module.exports = (twitterOptions, query) => {
    let accessToken = null
    let bearerToken = Buffer(
        encodeURIComponent(twitterOptions.apiKey) + ':' + encodeURIComponent(twitterOptions.apiSecret)
    ).toString('base64')

    const getAccessToken = () => {
        if (accessToken) return accessToken

        let options = {
            hostname: 'api.twitter.com',
            port: 443,
            method: 'POST',
            path: '/oauth2/token?grant_type=client_credentials',
            headers: {
                'Authorization': 'Basic ' + bearerToken
            }
        }

        return new Promise((resolve, reject) => {
            https.request(options, res => {
                let data = ''
                res.on('data', chunk => data += chunk)
                res.on('end', () => {
                    data = JSON.parse(data)
                    if (data.token_type !== 'bearer') return reject(new Error('twitter auth error 29'))
                    accessToken = data.access_token
                    return resolve(accessToken)
                })
            }).end()
        })
    }

    const searchTweets = async (search, count) => {
        if (!accessToken) await getAccessToken()
        let options = {
            hostname: 'api.twitter.com',
            port: 443,
            method: 'GET',
            path: '/1.1/search/tweets.json?q=' + encodeURIComponent(search) + '&count=' + (count || 10),
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        return new Promise((resolve, reject) => {
            https.request(options, res => {
                let data = ''
                res.on('data', chunk => data += chunk)
                res.on('end', () => {
                    return resolve(JSON.parse(data))
                })
            }).end()
        })
    }

    const embedTweets = async (url, options = {}) => {
        if (!accessToken) return accessToken
        options.url = url
        let requestOptions = {
            hostname: 'api.twitter.com',
            port: 443,
            method: 'GET',
            path:'/1.1/statuses/oembed.json?' + qs.stringify(options),
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        return new Promise((resolve, reject) => {
            https.request(requestOptions, res => {
                let data = ''
                res.on('data', chunk => data += chunk)
                res.on('end', () => {
                    return resolve(JSON.parse(data))
                })
            }).end()
        })
    }

    return {
        getTweets: ((query) => {
            let topTweets = {
                count: 2,
                lastRefreshed: 0,
                refreshRate: 15 * 60 * 1000,
                tweets: ['hello', 'bye']
            }

            return async () => {
                if (Date.now() > topTweets.lastRefreshed + topTweets.refreshRate) {
                    let tweets = await searchTweets(query, topTweets.count)
                    let formattedTweets = await Promise.all(
                        tweets.statuses.map(async ({id_str, user}) => {
                            let url = `https://twitter.com/${user.id_str}/statuses/${id_str}`
                            let embeddedTweets = await embedTweets(url, {omit_script: 1})
                            return embeddedTweets.html
                        })
                    )
                    topTweets.lastRefreshed = Date.now()
                    topTweets.tweets = formattedTweets
                }
                console.log('tweets')
                return topTweets.tweets
            }
        })(query)
    }
}