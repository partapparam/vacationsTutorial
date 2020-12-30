const db = require('../../mongodb')

exports.home = (req, res) => res.render('home')
exports.about = (req, res) => res.render('about')
exports.login = (req, res) => res.render('login')
exports.account = (req, res) => {
    console.log(req.user)
    let user = {
        name: req.user.name,
        role: req.user.role
    }
    res.render('account', { user: user})
}
exports.notFound = (req, res) => res.render('404')
exports.serverError = (err, req, res, next) => res.render('500')