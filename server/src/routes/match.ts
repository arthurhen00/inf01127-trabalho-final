import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ContractStatus, MatchStatus } from '../utils/types'

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

    // Altera o status do match request, Accept | Reject
    app.put('/matchRequest/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const bodySchema = z.object({
            status: z.string()
        })

        const { status } = bodySchema.parse(request.body)

        const matchResposne = await prisma.match.findUniqueOrThrow({
            where: {
                id,
            }
        })

        if (matchResposne.receiverId != request.user.sub) {
            return reply.status(401).send()
        }

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
                available: true,
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

    // Cria\atualiza contrato
    app.post('/match/contract', async (request, reply) => {
        const contractSchema = z.object({
            matchId: z.string().uuid(),
            contractType: z.string(),
            price: z.number(),
        })

        const { matchId, contractType, price } = contractSchema.parse(request.body)
        
        const match = await prisma.match.findUniqueOrThrow({
            where:{
                id: matchId,
            },
        })

        if (match.receiverId != request.user.sub) {
            return reply.status(401).send()
        }

        let contract = await prisma.contract.findUnique({
            where: {
                matchId: matchId,
            },
        })

        if (!contract) {
            contract = await prisma.contract.create({
                data: {
                    matchId,
                    contractType,
                    price,
                    contractStatus: ContractStatus.pending,
                },
            })

            return contract
        }

        contract = await prisma.contract.update({
            where: {
                id: contract.id
            },
            data: {
                contractType,
                price,
            }
        })

        return contract
    })

    // Atualiza o contrato, finaliza compra
    app.put('/match/contract/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string(),
        })

        const { id } = paramsSchema.parse(request.params)

        let contract = await prisma.contract.findUniqueOrThrow({
            where: {
                id,
            },
        })

        let match = await prisma.match.findUniqueOrThrow({
            where: {
                id: contract.matchId,
            },
        })

        if (match.requesterId != request.user.sub) {
            return reply.status(401).send()
        }

        contract = await prisma.contract.update({
            where: {
                id,
            },
            data: {
                contractStatus: ContractStatus.complete,
            },
        })

        const property = await prisma.property.update({
            where: {
                id: match.propertyId,
            },
            data: {
                available: false,
            },
        })

        match = await prisma.match.update({
            where: {
                id: contract.matchId,
            },
            data: {
                matchStatus: MatchStatus.complete,
            },
        })

        return { contract, property, match }
    })

    // Lista 1 contrato pelo seu ID
    app.get('/match/contract/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string(),
        })

        const { id } = paramsSchema.parse(request.params)

        const contract = await prisma.contract.findUniqueOrThrow({
            where: {
                id,
            },
        })

        const match = await prisma.match.findUniqueOrThrow({
            where: {
                id: contract.matchId,
            },
        })

        if (!(match.receiverId === request.user.sub || match.requesterId === request.user.sub)) {
            return reply.status(401).send()
        }

        return contract
    })

    // Lista o contrato de um match
    app.get('/contract/match/:id', async (request, reply) => {
        const paramsSchema = z.object({
            id: z.string(),
        })

        const { id } = paramsSchema.parse(request.params)

        const match = await prisma.match.findUniqueOrThrow({
            where: {
                id,
            },
        })

        const contract = await prisma.contract.findUnique({
            where: {
                matchId: match.id,
            },
        })

        if (!contract) {
            return reply.status(401).send()
        }

        if (!(match.receiverId === request.user.sub || match.requesterId === request.user.sub)) {
            return reply.status(401).send()
        }

        return contract
    })
}