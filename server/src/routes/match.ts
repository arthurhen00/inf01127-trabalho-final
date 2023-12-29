import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function matchRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    // Create matchRequest
    app.post('/matchRequest', async (request) => {
        const userSchema = z.object({
            receiverId: z.string(),
            propertyId: z.string(),
        })

        const { receiverId, propertyId } = userSchema.parse(request.body)
        
        const matchRequest = await prisma.matchRequest.create({
            data: {
                requesterId: request.user.sub,
                receiverId,
                propertyId,
            },
        })

        return matchRequest
   
    })

    // List match Requet
    app.get('/matchRequest', async (request) => {
        const matches = await prisma.matchRequest.findMany({
            where: {
                receiverId: request.user.sub,
            },
            orderBy: {
                createdAt: 'asc',
            },
        })

        return matches
    })

    // Delete matchRequest
    app.delete('/matchRequest/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const matches = await prisma.matchRequest.findUniqueOrThrow({
            where: {
                id,
            },
        })

        if (matches.receiverId != request.user.sub) {
            return reply.status(401).send()
        }

        await prisma.matchRequest.delete({
            where: {
                id,
            }
        })
    })

    // Create match

    // List match

}