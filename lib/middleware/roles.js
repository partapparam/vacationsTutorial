module.exports = {
    customersOnly: (req, res, next) => {
        if (req.user.role !== 'customer' || !req.user) return res.redirect(403, '/login')
        next()
    },
    employeesOnly: (req, res, next) => {
        if (!req.user || req.user.role !== 'employee') return next('route')
        next()
    }
}