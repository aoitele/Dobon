const next = require('next')
const fastify = require('fastify')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const server = fastify()

server.register(require('fastify-socket.io'), {})
app.prepare().then(() => {
    server.all('*', (req, res) => handle(req.raw, res.raw))

    server.listen(3000, (err, address) => {
        if(err) throw err
        console.log(`Server listening at ${address}`)
    })    
})

