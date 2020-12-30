const db = require('./mongodb')
const geocode = require('./lib/geocode')

const geocodeVacations = async () => {
    let vacations = await db.getVacations()
    let vacationsWithoutCoordinates = vacations.filter(async ({ location }) => !location.coordinates || typeof location.coordinates.lat !== 'number')

    return Promise.all(
        vacationsWithoutCoordinates.map(async ({ sku, location }) => {
            let { search } = location
            if (typeof search !== 'string' || !/\w/.test(search)) return console.log('erorr')

            try {
                let coordinates = await geocode(search)
                await db.addLocationDataBySku(sku, { location: {search, coordinates}})
            } catch (err) {
                console.log(err)
            }
        })
    )
}

geocodeVacations()
.then(() => {
    console.log('done')
    db.close()
}).catch((err) => {
    console.log('error while seeding locations')
    db.close()
})