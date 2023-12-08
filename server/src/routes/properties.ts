import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { request } from 'http'

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
    app.post('/properties/', async () => {
        
    })
    
    // Atualização
    app.put('/properties/:id', async () => {

    })
    
    // Atualização
    app.delete('/properties/:id', async () => {

    })

}