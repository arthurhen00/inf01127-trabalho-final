'use client'

import { useMultiChatLogic } from 'react-chat-engine-advanced'
import { PrettyChatWindow } from 'react-chat-engine-pretty'

export default function ChatBox(props: { name: string, 
                                         email: string, 
                                         sub: string, 
                                         receiverEmail: string, 
                                         requesterEmail: string }) {
    const chatProps = useMultiChatLogic('f04be4f9-1a7c-4608-b794-a0d3c3bc0682', props.email, props.sub)

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
                        projectId="f04be4f9-1a7c-4608-b794-a0d3c3bc0682"
                        username={props.email}
                        secret={props.sub}
                        style={{ height: '100vh' }}
                        />
                </div>
            }
        </>
    )
  }
  