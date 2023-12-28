import Header from '@/components/Header'
import Menu from '@/components/Menu'
import EmptyPropertyList from '@/components/EmptyPropertyList'
import Explorer from '@/components/Explorer'
import { api } from '@/lib/api'
import { cookies } from 'next/headers'

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

export default async function ListProperty() {
    const token = cookies().get('token')?.value

    const propertyResponse = await api.get('/properties', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const propertiesData : Property[] = propertyResponse.data

    if (propertiesData.length == 0) {
        return (<EmptyPropertyList />)
    }
    const properties = await Promise.all(
        propertiesData.map(async (property) => {
          const imageResponse = await api.get(`/images/${property.id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const images = imageResponse.data;
          property.images = images;
          console.log(property)
          return property;
        })
      );

    return(
    <div className='flex flex-col items-stretch bg-gray-100 h-screen'>      
            <Header />
            <Menu />
        

        <main className='bg-gray-100 px-24 h-80 flex-1'>
            <Explorer properties={properties}/>
        </main>
        </div>
    )
}
