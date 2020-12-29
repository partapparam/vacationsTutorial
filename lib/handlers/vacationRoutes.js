const db = require('../../mongodb')

exports.getVacations = async (req, res) => {
    let vacations = await db.getVacations({ available: true })
    let context = {
        vacations: vacations.map(v => ({
            name: v.name,
            price: v.price,
            description: v.description,
            sku: v.sku
        }))
    }
    res.render('vacations', context)
}
exports.subscribe = (req, res) => res.render('subscribe', { sku: req.query.sku })

exports.addSubscribe = async (req, res) => {
    let { email , sku } = req.body
    await db.subscribeToVacation({email, sku})
    res.redirect(303, '/vacations')
}