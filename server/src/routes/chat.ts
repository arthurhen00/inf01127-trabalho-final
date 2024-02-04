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
            chatName: z.string(),
        })

        const { receiverId, receiverEmail, requesterId, requesterEmail, chatName } = chatSchema.parse(request.body)
        
        // cria um usuario na api para o receiver
        try {
            const responseReceiver = await axios.put(
                'https://api.chatengine.io/users/',
                {username: receiverEmail, secret: receiverId, first_name: receiverEmail},
                {headers: {'private-key': '861bf9d9-4015-4555-8370-5b6dbf3b4ef9'}}
            )
        } catch (e) {
            // TODO
        }
                
        // cria um usuario na api para o requester
        try {
            const responseRequester = await axios.put(
                'https://api.chatengine.io/users/',
                {username: requesterEmail, secret: requesterId, first_name: requesterEmail},
                {headers: {'private-key': '861bf9d9-4015-4555-8370-5b6dbf3b4ef9'}}
            )
        } catch (e) {
            // TODO
        }

        // cria um chat do receiver com o requester
        try{
            const responseChatCreate = await axios.put(
                'https://api.chatengine.io/chats/',
                {usernames: [requesterEmail], title: chatName, is_direct_chat: true},
                {headers: {
                    'project-id': 'fdc9b408-5d6b-4438-8afc-3cb503659193',
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