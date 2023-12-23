import { api } from '@/lib/api'
import { cookies } from 'next/headers'
import EmptyPropertyList from './EmptyPropertyList'
import Image from 'next/image'
import dayjs from 'dayjs'

import { CiSearch, CiEdit } from "react-icons/ci"
import { MdDeleteOutline } from "react-icons/md"

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
          const imageResponse = await api.get(`/images/${property.id}`)
          const images = imageResponse.data
    
          return { property, images }
        })
    )

    return(
        <div className='w-1/3 mr-4'>
            {properties.map(property => {
                return (
                    <div key={property.property.id} className='py-4'>
                        <Image src={property.images[0].imageUrl} width={800} height={300} alt='' className='rounded-lg object-cover' />
                        <span className='flex items-center text-black text-2xl'>{property.property.name}</span>
                        <div className='flex flex-row items-center text-sm text-black justify-between'>
                            <div>
                                <span>{property.property.city}</span>
                                <span>{', '}</span>
                                <span>{property.property.state}</span>
                            </div>
                            <div>
                                <time className=''>
                                    {dayjs(property.property.createdAt).format('D[ de ]MMMM[, ]YYYY')}
                                </time>
                            </div>
                        </div>
                        <div className='flex flex-row text-sm text-black'>
                            <a href={`/my-properties/details/${property.property.id}`} className='mr-2 flex hover:text-gray-500 items-center'>
                                <CiSearch />
                                Detalhes
                            </a>
                            <a href={`/my-properties/edit/${property.property.id}`} className='mr-2 flex hover:text-gray-500 items-center'>
                                <CiEdit />
                                Editar
                            </a>
                            <a href={`/my-properties/delete/${property.property.id}`} className='flex hover:text-red-500 items-center'>
                                <MdDeleteOutline />
                                Excluir
                            </a>
                        </div>
                        <div className="border-2 flex flex-1 border-gray-500 mb-2"></div>
                    </div>        
                )
            })}
        </div>
    )
}


