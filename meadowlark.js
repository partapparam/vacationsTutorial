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

//register the routes
require('./routes')(app)

//get SSL certs
const httpsOptions = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
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