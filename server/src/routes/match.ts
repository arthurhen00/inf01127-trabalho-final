import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function matchRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    // Cria um request para o match
    app.post('/matchRequest', async (request) => {
        const userSchema = z.object({
            receiverId: z.string(),
            propertyId: z.string(),
        })

        const { receiverId, propertyId } = userSchema.parse(request.body)
        
        const matchRequest = await prisma.match.create({
            data: {
                requesterId: request.user.sub,
                receiverId,
                propertyId,
                matchStatus: 'Pending'
            },
        })

        return matchRequest
    })

    // Lista os request de match de um usuario
    app.get('/matchRequest', async (request) => {
        const matches = await prisma.match.findMany({
            where: {
                receiverId: request.user.sub,
                matchStatus: 'Pending'
            },
            orderBy: {
                propertyId: 'asc',
            },
        })

        return matches
    })

    // Lista um request para match
    app.get('/matchRequest/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const match = await prisma.match.findUniqueOrThrow({
            where: {
                id,
            }
        })

        return match
    })

    // List match
    app.get('/match', async (request) => {
        const matches = await prisma.match.findMany({
            where: {
                receiverId: request.user.sub,
            },
            orderBy: {
                propertyId: 'asc',
            },
        })

        return matches
    })

    // Altera o status do match request, Accept | Reject
    app.put('/matchRequest/:id', async (request) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            status: z.string()
        })

        const { status } = bodySchema.parse(request.body)

        const match = await prisma.match.update({
            where: {
                id,
            },
            data: {
                matchStatus: status
            },
        })

        return match
    })

    // Lista os matches aceitos (validos, prop onSale === true), tanto das minhas props curtidas, quanto as que eu curti
    app.get('/matchAccept', async (request) => {
        const validProperties = await prisma.property.findMany({
            where: {
                onSale: true,
            },
        })

        const validPropertyIds = validProperties.map(property => property.id)

        const matches = await prisma.match.findMany({
            where: {
                OR: [
                    {
                        receiverId: request.user.sub,
                        matchStatus: 'Accept',
                        propertyId: { in: validPropertyIds },
                    }, {
                        requesterId: request.user.sub,
                        matchStatus: 'Accept',
                        propertyId: { in: validPropertyIds },
                    }
                ]
            },
            orderBy: {
                propertyId: 'asc',
            },
        })

        return matches
    })

}