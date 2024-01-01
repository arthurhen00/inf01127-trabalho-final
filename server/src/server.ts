import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart  from '@fastify/multipart'
import faStatic  from '@fastify/static'
import { usersRoutes } from './routes/users'
import { propertiesRoutes } from './routes/properties'
import { uploadRoutes } from './routes/upload'
import { resolve } from 'path'
import { matchRoutes } from './routes/match'
import { chatRoutes } from './routes/chat'

const app = fastify()

app.register(cors, {
    origin: true,
})

app.register(jwt, {
    secret: 'swipehome-h178dg187shdu19dn19dg6218dogdqdg687',
})

app.register(multipart)

// seguranca foi pro caralho
app.register(faStatic, {
    root: resolve(__dirname, '../uploads'),
    prefix: '/uploads',
})

app.register(usersRoutes)
app.register(propertiesRoutes)
app.register(uploadRoutes)
app.register(matchRoutes)
app.register(chatRoutes)

app.get('/', () => {
    return 'kkk rodou'
})

app.listen({
    port: 6900,
}).then(() => {
    console.log('server running on localhost 6900')
})