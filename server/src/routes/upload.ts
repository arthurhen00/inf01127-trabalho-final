import { randomUUID } from 'node:crypto'
import { extname, resolve } from 'node:path'
import { FastifyInstance } from 'fastify'
import { createWriteStream } from 'node:fs'
import { pipeline } from 'node:stream'
import { promisify } from 'node:util'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const pump = promisify(pipeline)

export async function uploadRoutes(app: FastifyInstance) {
    
    // Upload de imagem
    app.post('/upload', async (request, reply) => {
        const upload = await request.file({
            limits: {
                fileSize: 5_242_880, // 5 MB
            },
        })

        if (!upload) {
            return reply.status(400).send()
        }
        
        const mimeTypeRegex = /^(image|video)\/[a-zA-Z]+/
        const isValidFileFormat = mimeTypeRegex.test(upload.mimetype)
        
        if (!isValidFileFormat) {
            return reply.status(400).send()
        }

        const fileId = randomUUID()
        const extension = extname(upload.filename)

        const filename = fileId.concat(extension)

        const writeStream = createWriteStream(
            resolve(__dirname, '../../uploads/', filename)
        )

        await pump(upload.file, writeStream)

        const fullUrl = request.protocol.concat('://').concat(request.hostname)
        const fileUrl = new URL(`/uploads/${filename}`, fullUrl).toString()

        return { fileUrl }
    })

    // Deletar o arquivo do servidor
    app.delete('/delete-image/:id', async (request, reply) => {

    })

    // Relaciona imagem -> propriedade
    app.post('/images', async (request) => {
        await request.jwtVerify()

        const bodySchema = z.object({
            imageUrl: z.string(),
            propertyId: z.string(),
        })

        const { imageUrl, propertyId } = bodySchema.parse(request.body)
        
        const image = await prisma.image.create({
            data: {
                imageUrl,
                propertyId,
            },
        })

        return image
    })

    // Imagens de uma propriedade
    app.get('/images/:id', async (request) => {
        await request.jwtVerify()

        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const image = await prisma.image.findMany({
            where: {
                propertyId: id,
            },
            select: {
                imageUrl: true,
            },
        })

        return image
    })

    // Delete Imagens de uma propriedade
    app.delete('/images/:id', async (request) => {
        await request.jwtVerify()

        const paramsSchema = z.object({
            id: z.string().uuid(),
        })

        const { id } = paramsSchema.parse(request.params)

        const image = await prisma.image.deleteMany({
            where: {
                propertyId: id,
            }
        })

        return image
    })
 
}