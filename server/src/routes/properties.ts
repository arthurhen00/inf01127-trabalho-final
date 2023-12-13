import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function propertiesRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    // Listagem
    app.get('/properties', async (request) => {
        const properties = await prisma.property.findMany({
            where: {
                userId: request.user.sub, // id do usuario autenticado
            },
            orderBy: {
                createdAt: 'asc',
            },
        })

        return properties
    })
    
    // Detalhe
    app.get('/properties/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const property = await prisma.property.findUniqueOrThrow({
            where: {
                id,
            }
        })

        if (property.userId != request.user.sub) {
            return reply.status(401).send()
        }

        return property

    })
    
    // Criação
    app.post('/properties', async (request) => {
        const bodySchema = z.object({
            cep: z.string(),
            description: z.string(),
        })

        const { cep, description } = bodySchema.parse(request.body)
        
        const property = await prisma.property.create({
            data: {
                cep,
                description,
                userId: request.user.sub,
            },
        })

        return property
    })
    
    // Atualização
    app.put('/properties/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            cep: z.string(),
            description: z.string(),
        })

        const { cep, description } = bodySchema.parse(request.body)

        let property = await prisma.property.findUniqueOrThrow({
            where: {
                id,
            },
        })

        if (property.userId != request.user.sub) {
            return reply.status(401).send()
        }

        property = await prisma.property.update({
            where: {
                id,
            },
            data: {
                cep,
                description,
            },
        })

        return property
    })
    
    // Delete
    app.delete('/properties/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const property = await prisma.property.findUniqueOrThrow({
            where: {
                id,
            },
        })

        if (property.userId != request.user.sub) {
            return reply.status(401).send()
        }

        await prisma.property.delete({
            where: {
                id,
            }
        })
    })

}