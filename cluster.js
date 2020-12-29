const cluster = require('cluster')
const app = require('./meadowlark')
const os = require('os')
const cpus = os.cpus()

const createWorker = () => {
    let worker = cluster.fork()
}

if (cluster.isMaster) {
    cpus.forEach(createWorker)

    cluster.on('online', worker => {
        console.log(`Worker ${worker.id} is up`)
    })

    cluster.on('exit', (worker, code, signal) => {
        console.log(`Worker ${worker.id} down`)
        createWorker()
    })
} else {
    let port = process.env.port || 3000
    app(port)
}