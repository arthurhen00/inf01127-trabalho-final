import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'


export async function propertiesRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.get('/properties', async (request) => {
        const properties = await prisma.property.findMany({
            where: {
                userId: {
                    not: request.user.sub,
                },
                available: true,
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

        /*if (property.userId != request.user.sub) {
            return reply.status(401).send()
        }*/

        return property

    })
    
    // Criação
    app.post('/properties', async (request, reply) => {
        const bodySchema = z.object({
            name : z.string(),
            cep: z.string(),
            state: z.string(),
            district: z.string(),
            city: z.string(),
            address: z.string(),
            price: z.number(),
            description: z.string(),
            propertyType: z.string(),
            propertyNumber: z.number(),
            numBedroom: z.number(),
            numBathroom: z.number(),
            adType : z.string().refine((value) => value === 'rent' || value === 'sale', { message: 'adType must be either "rent" or "sale"'}),
            numParkingSpots: z.number(),
            size: z.number()
        })

        console.log(request.body)
        
        const form = bodySchema.safeParse(request.body)
        
        if (!form.success) {
            const { errors } = form.error;

            console.log(errors)
            
            return reply.status(400).send({
                error: { message: "Invalid request", errors },
            })
        }

        const { name, cep, state,district, city, 
                address, price, description, propertyType,
                propertyNumber, numBedroom, numBathroom, adType } = form.data;
        

        const property = await prisma.property.create({
            data: {
                name,
                zipcode: cep,
                state,
                city,
                district,
                address,
                price,
                description,
                propertyType,
                propertyNumber,
                numBedroom,
                numBathroom,
                userId: request.user.sub,
                adType,
                numParkingSpots,
                size,

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
            name : z.string(),
            cep: z.string(),
            state: z.string(),
            city: z.string(),
            address: z.string(),
            price: z.number(),
            description: z.string(),
            propertyType: z.string(),
            propertyNumber: z.number(),
            numBedroom: z.number(),
            numBathroom: z.number(),
            adType : z.string().refine((value) => value === 'rent' || value === 'sale', { message: 'adType must be either "rent" or "sale"'}),
        })

        const form = bodySchema.safeParse(request.body)
        
        if (!form.success) {
            const { errors } = form.error;

            console.log(errors)
            
            return reply.status(400).send({
                error: { message: "Invalid request", errors },
            })
        }

        const { name, cep, state, city, 
            address, price, description, propertyType,
            propertyNumber, numBedroom, numBathroom, adType } = form.data;

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
                name,
                zipcode: cep,
                state,
                city,
                address,
                price,
                description,
                propertyType,
                propertyNumber,
                numBedroom,
                numBathroom,
                adType,
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

    // Detalhe propriedade comprada, match, contrato
    app.get('/properties/purchased', async (request) => {
        const matches = await prisma.match.findMany({
            where: {
                requesterId: request.user.sub,
                matchStatus: 'Complete'
            }
        })
        const propertyIds = matches.map(match => match.propertyId)
        const matchesIds = matches.map(match => match.id)
        
        const properties = await prisma.property.findMany({
            where: {
                id: {
                    in: propertyIds,
                }
            }
        })

        const contracts = await prisma.contract.findMany({
            where: {
                matchId: {
                    in: matchesIds,
                }
            }
        })

        const imagesPromises = properties.map(property => {
            return prisma.image.findMany({
                where: {
                    propertyId: property.id,
                },
                select: {
                    imageUrl: true,
                    imageId: true,
                },
            })
        })
        const imagesData = await Promise.all(imagesPromises)

        const sellers = await Promise.all(matches.map(match =>
            prisma.user.findUnique({
                where: {
                    id: match.receiverId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            })
        ))

        const combinedData = properties.map((property, index) => {
            const match = matches.find(match => match.propertyId === property.id)
            const contract = contracts.find(contract => contract.matchId === match?.id)
            const propertyImages = imagesData[index]
            const seller = sellers[index]

            return {
                propertyData: {
                    ...property,
                    images: propertyImages,
                },
                matchData: match,
                contractData: contract,
                sellerData: seller,
            }
        })

        return combinedData
    })

    // Detalhe propriedade vendida, match, contrato
    app.get('/properties/sold', async (request) => {
        const matches = await prisma.match.findMany({
            where: {
                receiverId: request.user.sub,
                matchStatus: 'Complete'
            }
        })
        const propertyIds = matches.map(match => match.propertyId)
        const matchesIds = matches.map(match => match.id)
        
        const properties = await prisma.property.findMany({
            where: {
                id: {
                    in: propertyIds,
                }
            }
        })

        const contracts = await prisma.contract.findMany({
            where: {
                matchId: {
                    in: matchesIds,
                }
            }
        })

        const imagesPromises = properties.map(property => {
            return prisma.image.findMany({
                where: {
                    propertyId: property.id,
                },
                select: {
                    imageUrl: true,
                    imageId: true,
                },
            })
        })
        const imagesData = await Promise.all(imagesPromises)

        const sellers = await Promise.all(matches.map(match =>
            prisma.user.findUnique({
                where: {
                    id: match.requesterId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            })
        ))
        
        const combinedData = properties.map((property, index) => {
            const match = matches.find(match => match.propertyId === property.id)
            const contract = contracts.find(contract => contract.matchId === match?.id)
            const propertyImages = imagesData[index]
            const seller = sellers[index]
            
            return {
                propertyData: {
                    ...property,
                    images: propertyImages,
                },
                matchData: match,
                contractData: contract,
                sellerData: seller,
            }
        })

        return combinedData
    })

}