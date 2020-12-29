const db = require('../mongodb')
const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy
const https = require('https')

passport.serializeUser((user, done) => done(null, user._id))
passport.deserializeUser((id, done) => {
    db.getUserById(id)
        .then(user => done(null, user))
        .catch(err => done(err, null))
})

module.exports = (app, options = {}) => {
    const config = options.authProviders
    if (!options.failureRedirect) options.failureRedirect = '/login'
    if (!options.successRedirect) options.successRedirect = '/account'
//    TODO create account page
    return {
        init: () => {
            passport.use('facebook', new FacebookStrategy({
                clientID: config.facebook.clientID,
                clientSecret: config.facebook.clientSecret,
                callbackURL: (options.baseUrl || '') + '/auth/facebook/callback'
            }, (accessToken, refreshToken, profile, done) => {
                    let authId = 'facebook:' + profile.id
                    db.getUserByAuthId(authId)
                        .then(user => {
                            if (user) return done(null, user)
                            db.addUser({
                                name: profile.displayName,
                                authId: authId,
                                role: 'customer',
                                created: Date.now()
                            })
                                .then(user => done(null, user))
                                .catch(err => done(err, null))
                        })
                        .catch(err => done(err, null))
            }))

            app.use(passport.initialize())
            app.use(passport.session())
        },
        registerRoutes: () => {
            app.get('/auth/facebook', (req, res, next) => {
                if (req.query.redirect) req.session.authRedirect = req.query.redirect
                passport.authenticate('facebook')(req, res, next)
            })
            app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: options.failureRedirect }), (req, res) => {
                let redirect = req.session.authRedirect
                if (redirect) delete req.session.authRedirect
                res.redirect(303, (redirect || options.successRedirect))
            })
        }
    }


}