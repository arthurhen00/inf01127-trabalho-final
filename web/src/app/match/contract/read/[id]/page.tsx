import { cookies } from 'next/headers'
import Header from '@/components/Header'
import Menu from '@/components/Menu'
import Unauthenticated from '@/components/Unauthenticated'
import { GetServerSidePropsContext } from 'next'
import { api } from '@/lib/api'
import ShowContract from '@/components/ShowContract'
import Unauthorized from '@/components/Unauthorized'
import { getUser } from '@/lib/auth'
 
export default async function ReadContractPage(context: GetServerSidePropsContext) {
  const isAuthenticated = cookies().has('token')
  const { sub } = getUser()

  if (!isAuthenticated) {
    return (<Unauthenticated />)
  }

  const matchId = context.params?.id
  const token = cookies().get('token')?.value

  const matchResponse = await api.get(`/matchRequest/${matchId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
  })
  const match : MatchRequest = matchResponse.data

  if( !(match.requesterId != sub || match.receiverId != sub) ) {
    return (<Unauthorized />)
  }

  const propertyResponse = await api.get(`/properties/${match.propertyId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
  })
  const property : Property = propertyResponse.data

  return (
      <div className='flex flex-col h-screen bg-gray-100'>        
        <Header />
        <Menu />

        <main className='bg-gray-100 px-24'>
            {/** Menu info */}
            <div className="flex flex-1 justify-between">
                <h1>Anúncio: {property.name}{', '}{property.state}{' - R$ '}{property.price}</h1>
                <div>
                    <a href="/match" className="text-black hover:text-gray-500 hover:underline mr-4">Voltar</a>
                    <a href={`a`} className="text-black hover:text-gray-500 hover:underline">Assinar</a>
                </div>
                </div>
            <div className="border-[1px] flex flex-1 border-gray-400 mb-2"></div>

            <ShowContract property={property} matchId={matchId} />
        </main>
      </div>
  )
}

  