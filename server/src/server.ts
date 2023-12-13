import fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart  from '@fastify/multipart'
import { usersRoutes } from './routes/users'
import { propertiesRoutes } from './routes/properties'
import { uploadRoutes } from './routes/upload'

const app = fastify()

app.register(cors, {
    origin: true,
})

app.register(jwt, {
    secret: 'swipehome-h178dg187shdu19dn19dg6218dogdqdg687',
})

app.register(multipart)

app.register(usersRoutes)
app.register(propertiesRoutes)
app.register(uploadRoutes)

app.get('/', () => {
    return 'kkk rodou'
})

app.listen({
    port: 6900,
}).then(() => {
    console.log('server running on localhost 6900')
})