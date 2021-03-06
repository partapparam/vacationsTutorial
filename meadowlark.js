const express = require('express')
const app = express()
const port = process.env.port || 3000
const { credentials } = require('./config')
const expressSession = require('express-session')
const bodyParser = require('body-parser')
const handlebars = require('express-handlebars')
const fs = require('fs')
const https = require('https')
const morgan = require('morgan')
const multiparty = require('multiparty')
const flashMiddleWare = require('./lib/middleware/flash')
const rolesMiddleware = require('./lib/middleware/roles')
require('./mongodb')

app.disable('x-powered-by')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret
}))
app.engine('hbs', handlebars({
    defaultLayout: 'main.hbs'
}))
app.set('view engine', 'hbs')
app.use(flashMiddleWare)

//create the Auth middleware
const createAuth = require('./lib/auth')
const auth = createAuth(app, {
    baseUrl: process.env.BASE_URL || '',
    authProviders: credentials.authProviders,
    failureRedirect: '/login',
    successRedirect: '/account'
})
//initialize auth functions
auth.init()
auth.registerRoutes()
//register the routes
require('./routes')(app)

//get SSL certs
const httpsOptions = {
    key: fs.readFileSync('privkey.pem'),
    cert: fs.readFileSync('certificate.pem')
}
const startServer = (port) => {
    https.createServer(httpsOptions, app).listen(port, () => console.log('listening'))
    // app.listen(port, () => console.log('listening'))
}

if (require.main === module) {
    startServer(port)
} else {
    module.exports = startServer
}