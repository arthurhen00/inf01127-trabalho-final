import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function usersRoutes(app: FastifyInstance) {

    // Listar propriedades a venda
    app.get('/user/properties', async (request, reply) => {
        await request.jwtVerify()
        try{
            const properties = await prisma.property.findMany({
                where: {
                    userId: request.user.sub, // id do usuario autenticado
                    available: true,
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

    // Listar propriedades vendidas
    app.get('/user/sold/properties', async (request, reply) => {
        await request.jwtVerify()
        try{
            const properties = await prisma.property.findMany({
                where: {
                    userId: request.user.sub, // id do usuario autenticado
                    available: false,
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

    app.get('/user', async (request) => {
        await request.jwtVerify()
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                id: request.user.sub,
            },
            select: {
                id: true,
                name: true,
                email: true,
                cpf: true,
                city: true,
            }
        })

        return user
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

    // Cria um historico
    app.post('/user/history', async (request) => {
        await request.jwtVerify()

        const historySchema = z.object({
            userId: z.string(),
            propertyId: z.string(),
            isLiked: z.coerce.boolean().default(false),
        })

        const { userId, propertyId, isLiked } = historySchema.parse(request.body)
    
        const history = await prisma.userExplorerHistory.create({
            data: {
                userId,
                propertyId,
                isLiked,
            },
        })

        return history
    })

    app.put('/user/:id', async (request, reply) => {
        await request.jwtVerify()
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            name : z.string(),
            email: z.string(),
            city: z.string(),
        })
        const form = bodySchema.safeParse(request.body)
        
        if (!form.success) {
            const { errors } = form.error;
            
            console.log(errors)
            
            return reply.status(400).send({
                error: { message: "Invalid request", errors },
            })
        }
        
        const { name, email, city } = form.data
        
        let user = await prisma.user.findUniqueOrThrow({
            where: {
                id,
            },
        })
        
        if (user.id != request.user.sub) {
            return reply.status(401).send()
        }

        user = await prisma.user.update({
            where: {
                id,
            },
            data: {
                name,
                email,
                city,
            },
        })

        return user
    })
}