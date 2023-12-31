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

    // List match Request
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

    // List match Request ID
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

    // Delete matchRequest
    app.delete('/matchRequest/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const matches = await prisma.match.findUniqueOrThrow({
            where: {
                id,
            },
        })

        if (matches.receiverId != request.user.sub) {
            return reply.status(401).send()
        }

        await prisma.match.delete({
            where: {
                id,
            }
        })
    })

    // Create match
    app.post('/match', async (request) => {
        const userSchema = z.object({
            requesterId: z.string(),
            propertyId: z.string(),
        })

        const { requesterId, propertyId } = userSchema.parse(request.body)
        
        const matchRequest = await prisma.match.create({
            data: {
                requesterId,
                receiverId: request.user.sub,
                propertyId,
                matchStatus: 'Pending',
            },
        })

        return matchRequest
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

}