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

    return (
        <ChatBox name={name} email={email} sub={sub} />
    )
    
}
  