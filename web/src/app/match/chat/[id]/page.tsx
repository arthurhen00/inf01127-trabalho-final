import ChatBox from '@/components/ChatBox'
import Unauthenticated from '@/components/Unauthenticated'
import { api } from '@/lib/api'
import { getUser } from '@/lib/auth'
import { GetServerSidePropsContext } from 'next'
import { cookies } from 'next/headers'

export default async function ChatPage(context: GetServerSidePropsContext) {
    const isAuthenticated = cookies().has('token')
    const {name, email, sub} = getUser()

    if (!isAuthenticated) {
        return (<Unauthenticated />)
    }

    const token = cookies().get('token')?.value
    const matchId = context.params?.id

    const response = await api.get(`/matchRequest/${matchId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const match = response.data

    const responseReceiver = await api.get(`/user/${match.receiverId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const receiver = responseReceiver.data
    
    const responseRequester = await api.get(`/user/${match.requesterId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const requester = responseRequester.data

    return (
        <ChatBox name={name} email={email} sub={sub} receiverEmail={receiver.email} requesterEmail={requester.email} />
    )
    
}
  