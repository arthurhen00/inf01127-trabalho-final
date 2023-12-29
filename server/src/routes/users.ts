import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function usersRoutes(app: FastifyInstance) {

    // Listar propriedades
    app.get('/user/properties', async (request, reply) => {
        await request.jwtVerify()
        try{
            const properties = await prisma.property.findMany({
                where: {
                    userId: request.user.sub, // id do usuario autenticado
                },
                orderBy: {
                    createdAt: 'asc',
                },
            })

            return properties
        }catch(e){
            return reply.status(404).send();
        }
    })

    // Lista 1 usuario
    app.get('/user/:id', async (request) => {
        await request.jwtVerify()
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id,
            },
            select: {
                id: true,
                name: true,
                email: true,
            },
        })

        return user
    })

    app.get('/users', async () => {
        const users = await prisma.user.findMany({
            orderBy: {
                name: 'asc',
            },
        })

        return users
    })
    
    app.post('/register', async (request, reply) => {
        const userSchema = z.object({
            name: z.string(),
            cpf: z.string(),
            email: z.string(),
            password: z.string(),
        })

        const { name, cpf, email, password } = userSchema.parse(request.body)
        
        try{
            const user = await prisma.user.create({
                data: {
                    name,
                    cpf,
                    email,
                    password,
                },
            })

            // identificacao do usuario
            const token = app.jwt.sign({
                name: name,
                email: email,
            }, {
                sub: user.id,
                expiresIn: '30 days',
            })

            return {
                token,
            }
        } catch(e){
            return reply.status(409).send();
        }
        
        
    })

    app.post('/login', async (request, reply) => {
        const userSchema = z.object({
            email: z.string(),
            password: z.string(),
        })
        const { email, password } = userSchema.parse(request.body)
    
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
    
        if (!user) {
            return reply.status(401).send();
        }

        if (user.password === password) {
            const token = app.jwt.sign({
                name: user.name,
                email: user.email,
            }, {
                sub: user.id,
                expiresIn: '30 days',
            })
    
            return {
                token,
            }
        } else {
            return reply.status(401).send();
        }
    })   
}