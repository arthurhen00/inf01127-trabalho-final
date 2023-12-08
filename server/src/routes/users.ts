import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function usersRoutes(app: FastifyInstance) {
    app.get('/users', async () => {
        const users = await prisma.user.findMany({
            orderBy: {
                name: 'asc',
            },
        })

        return users
    })
    
    app.post('/register', async (request) => {
        const userSchema = z.object({
            name: z.string(),
            email: z.string(),
            password: z.string(),
        })

        const { name, email, password } = userSchema.parse(request.body)
        
        let user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
        
        if (!user) {
            user = await prisma.user.create({
                data: {
                    name,
                    email,
                    password,
                },
            })
        }
        
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

    app.get('/teste', async (request) => {
        await request.jwtVerify()

        const teste = await prisma.user.findMany({
            where: {
                email: request.user.email,
            },
        })

        return teste
    })
    
    
}