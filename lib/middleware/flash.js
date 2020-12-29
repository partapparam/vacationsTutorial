module.exports = (req, res, next) => {
    if (req.session.flash) {
        res.locals.flash = req.session.flash
    }
    next()
}