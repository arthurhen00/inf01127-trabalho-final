import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { usersRoutes } from './routes/users'

const app = fastify()

app.register(cors, {
    origin: true,
})

app.register(jwt, {
    secret: 'swipehome-h178dg187shdu19dn19dg6218dogdqdg687',
})

app.register(usersRoutes)

app.get('/', () => {
    return 'kkk rodou'
})

app.listen({
    port: 6900,
}).then(() => {
    console.log('server running on localhost 6900')
})