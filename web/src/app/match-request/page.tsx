import Header from '@/components/Header'
import Menu from '@/components/Menu'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'

export default async function MatchRequestPage() {

    const token = cookies().get('token')?.value

    const matchRequestResponse = await api.get('/matchRequest', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const matchRequest : MatchRequest[] = matchRequestResponse.data

    if (matchRequest.length === 0) {
        
    }

    const matches : MatchData[] = await Promise.all(
        matchRequest.map(async (match) => {
            const propertyResponse = await api.get(`/properties/${match.propertyId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const propertyData = propertyResponse.data

            const imageResponse = await api.get(`/images/${propertyResponse.data.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const imageData = imageResponse.data

            const userResponse = await api.get(`/user/${match.requesterId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const userData = userResponse.data

            const matchData = match
            
            return { userData, propertyData, imageData, matchData }
        })

    )

    return (
        <div className='flex flex-col h-screen bg-gray-100'>        
            <Header />
            <Menu />


            <main className='bg-gray-100 px-24'>

                {matchRequest.length === 0 ? 
                    <>Sem pedido</>
                : 
                
                <>
                
                <div className='flex items-center mb-4'>
                    <h1 className='text-2xl font-bold'>Interessados nas suas propriedades</h1>
                </div>
                {/** Property info */}
                <div className='flex flex-col'>
                    {matches.map((match : MatchData, index) => {
                        return(
                            <div key={index}>
                                <div className='flex flex-row'>
                                    <img
                                        src={match.imageData[0].imageUrl}
                                        alt=''
                                        className='h-[220px] w-[380px] rounded-lg object-cover'
                                    />

                                    <div className='flex flex-col w-72 ml-4 mr-4'>
                                        <div className='text-lg font-bold'>
                                            <span>Resumo da propriedade</span>
                                        </div>
                                        <div>
                                            <span>{match.propertyData.name}</span>
                                            {' - '}
                                            <span>{'R$ '}{match.propertyData.price}</span>
                                        </div>
                                        <div>
                                            <span>{match.propertyData.address}</span>
                                        </div>
                                        <div>
                                            <span>{match.propertyData.city}</span>
                                            {', '}
                                            <span>{match.propertyData.state}</span>
                                            {', Nº '}
                                            <span>{match.propertyData.propertyNumber}</span>
                                        </div>
                                        <div>
                                            <p>{match.propertyData.description}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col justify-between flex-1'>
                                        <div>
                                            <div className='text-lg font-bold'>
                                                <span>Informações do interessado</span>
                                            </div>
                                            <div>
                                                <span>Nome: {match.userData.name}</span>
                                            </div>
                                            <div>
                                                <span>Email: {match.userData.email}</span>
                                            </div>
                                        </div>
                                        <div className='flex self-end'>
                                            <a href='' className='hover:text-gray-400'>Aceitar</a>
                                            <a href={`/match-request/reject?id=${match.matchData.id}`} className='ml-4 text-red-800 hover:text-red-600'>Recusar</a>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-2 flex flex-1 border-gray-500 mb-2 mt-1"></div>
                            </div>
                        )
                    })}
                </div>
                </>}
            </main>
        </div>
    )
}
