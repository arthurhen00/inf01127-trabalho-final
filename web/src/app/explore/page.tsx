import Header from '@/components/Header'
import Menu from '@/components/Menu'
import EmptyPropertyList from '@/components/EmptyPropertyList'
import Explorer from '@/components/Explorer'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import Unauthenticated from '@/components/Unauthenticated'

interface ImageInfo {
    imageUrl: string;
    imageId: string;
  }

interface Property {
    id: string
    name: string
    zipcode: string
    state: string
    city: string
    address: string
    price: number
    propertyType: string,
    propertyNumber: number,
    numBedroom: number,
    numBathroom: number,
    description: string
    createdAt: string
    userId: string
    images?: ImageInfo[]
}

export default async function ExplorePage() {
    const token = cookies().get('token')?.value
    const isAuthenticated = cookies().has('token')

    if (!isAuthenticated) {
      return (<Unauthenticated />)
    }

    const propertyResponse = await api.get('/properties', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const propertiesData : Property[] = propertyResponse.data

    const properties = await Promise.all(
        propertiesData.map(async (property) => {
          const imageResponse = await api.get(`/images/${property.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const images = imageResponse.data;
          property.images = images;
          return property;
        })
      );

  return(
    <div className='flex flex-col bg-gray-100 h-screen'>      
      <Header />
      <Menu />
        
      <main className='bg-gray-100 px-24 h-80 flex-1'>
          <h1 className='text-2xl font-bold mb-4'>Explorar</h1>
          {propertiesData.length == 0 ?
              <span>Desculpe, não encontramos nenhum imóvel.</span>
            :
              <Explorer properties={properties}/>
          }
      </main>
    </div>
  )
}
