'use client'

import { useMultiChatLogic } from 'react-chat-engine-advanced'
import { PrettyChatWindow } from 'react-chat-engine-pretty'

export default function ChatBox(props: { name: string, 
                                         email: string, 
                                         sub: string, 
                                         receiverEmail: string, 
                                         requesterEmail: string }) {
    const chatProps = useMultiChatLogic('fdc9b408-5d6b-4438-8afc-3cb503659193', props.email, props.sub)

    return (
        <>
            {!chatProps.activeChatId ?
                <>
                    Carregando...
                </>
            :
                <div className='h-screen'>
                    <a href='/match' className='ml-20 text-xl'>Voltar</a>
                        <PrettyChatWindow
                        projectId="fdc9b408-5d6b-4438-8afc-3cb503659193"
                        username={props.email}
                        secret={props.sub}
                        style={{ height: '100vh' }}
                        />
                </div>
            }
        </>
    )
  }
  