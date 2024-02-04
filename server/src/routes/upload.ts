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

        console.log(filename)

        const writeStream = createWriteStream(
            resolve(__dirname, '../../uploads/', filename)
        )

        await pump(upload.file, writeStream)

        const fullUrl = request.protocol.concat('://').concat(request.hostname)
        const fileUrl = new URL(`/uploads/${filename}`, fullUrl).toString()

        return { fileUrl, fileId }
    })

    // Relaciona imagem -> propriedade
    app.post('/images', async (request) => {
        await request.jwtVerify()

        const bodySchema = z.object({
            imageId: z.string(),
            imageUrl: z.string(),
            propertyId: z.string(),
        })

        const { imageId, imageUrl, propertyId } = bodySchema.parse(request.body)
        
        const image = await prisma.image.create({
            data: {
                imageId,
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
                imageId: true,
            },
        })

        return image
    })

    app.get('/images/list', async (request) => {
        await request.jwtVerify()
        const images = await prisma.image.findMany()
        return  images
    })


    // deleta todas as imagens de uma propriedade ID
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

    // Deleta um array de imagem
    app.delete('/images', async (request) => {
        await request.jwtVerify()

        const paramsSchema = z.object({
            ids: z.array(z.string()),
        })

        const { ids } = paramsSchema.parse(request.body)

        const image = await prisma.image.deleteMany({
            where: {
                imageId: {
                    in: ids,
                },
            },
        })

        return image
    })

    // Rota para excluir arquivos filename = id + extension
    app.delete('/upload/:filename', async (request, reply) => {
        await request.jwtVerify()

        const { unlink } = require('fs')

        const paramsSchema = z.object({
            filename: z.string(),
        })
 
        const { filename } = paramsSchema.parse(request.params);
        
        // Verifica se o fileId é fornecido
        if (!filename) {
            return reply.status(400).send({ error: 'File ID is required.' });
        }
        
        // Construa o caminho do arquivo
        const filePath = resolve(__dirname, '../../uploads/', filename);
        console.log(filename)
        console.log(filePath)
        // Tenta excluir o arquivo
        try {
            await promisify(unlink)(filePath);
        } catch (error) {
            // Se ocorrer um erro (por exemplo, arquivo não encontrado), retorne um status de erro
            return reply.status(500).send({ error: 'Failed to delete the file.' });
        }
        
        // Retorna uma resposta de sucesso
        return reply.send({ message: 'File deleted successfully.' });
    })

}