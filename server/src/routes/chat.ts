import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import axios from 'axios'

export async function chatRoutes(app: FastifyInstance) {
    app.addHook('preHandler', async (request) => {
        await request.jwtVerify()
    })

    app.post('/chat', async (request, reply) => {
        const chatSchema = z.object({
            receiverId: z.string(),
            receiverEmail: z.string(),
            requesterId: z.string(),
            requesterEmail: z.string(),
            propertyName: z.string(),
        })

        const { receiverId, receiverEmail, requesterId, requesterEmail, propertyName } = chatSchema.parse(request.body)
        
        // cria um usuario na api para o receiver
        try {
            const responseReceiver = await axios.put(
                'https://api.chatengine.io/users/',
                {username: receiverEmail, secret: receiverId, first_name: receiverEmail},
                {headers: {'private-key': '3d071a68-fe96-41a4-b88d-4a8aa34c4504'}}
            )
        } catch (e) {
            // TODO
        }
                
        // cria um usuario na api para o requester
        try {
            const responseRequester = await axios.put(
                'https://api.chatengine.io/users/',
                {username: requesterEmail, secret: requesterId, first_name: requesterEmail},
                {headers: {'private-key': '3d071a68-fe96-41a4-b88d-4a8aa34c4504'}}
            )
        } catch (e) {
            // TODO
        }

        // cria um chat do receiver com o requester
        try{
            const responseChatCreate = await axios.put(
                'https://api.chatengine.io/chats/',
                {usernames: [requesterEmail], title: 'Anúncio: ' + propertyName, is_direct_chat: true},
                {headers: {
                    'project-id': 'f04be4f9-1a7c-4608-b794-a0d3c3bc0682',
                    'user-name': receiverEmail,
                    'user-secret': receiverId,
                }}
            )
        } catch (e) {
            // TODO
        }

        return {ok: 'ok'}
    })
}