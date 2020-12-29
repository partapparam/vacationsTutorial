const vacationRoutes = require('./lib/handlers/vacationRoutes')
const mainRoutes = require('./lib/handlers/mainRoutes')

module.exports = app => {
    app.get('/', mainRoutes.home)
    app.get('/about', mainRoutes.about)
    app.get('/vacations', vacationRoutes.getVacations)
    app.get('/subscribe', vacationRoutes.subscribe)
    app.post('/addSubscribe', vacationRoutes.addSubscribe)
    app.use(mainRoutes.notFound)
    app.use(mainRoutes.serverError)
}

