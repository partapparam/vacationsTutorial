const vacationRoutes = require('./lib/handlers/vacationRoutes')
const mainRoutes = require('./lib/handlers/mainRoutes')
const rolesMiddleware = require('./lib/middleware/roles')

module.exports = app => {
    app.get('/', mainRoutes.home)
    app.get('/about', mainRoutes.about)
    app.get('/vacations', vacationRoutes.getVacations)
    app.get('/subscribe', vacationRoutes.subscribe)
    app.post('/addSubscribe', vacationRoutes.addSubscribe)
    app.get('/login', mainRoutes.login)
    app.get('/account', rolesMiddleware.customersOnly, mainRoutes.account)
    app.use(mainRoutes.notFound)
    app.use(mainRoutes.serverError)
}

