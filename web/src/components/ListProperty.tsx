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

    const propertyResponse = await api.get('/user/properties', {
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
          })
          const images = imageResponse.data
    
          return { property, images }
        })
    )

    return(
        <>
        { propertiesData.length == 0 ?
            <div className='w-1/3 py-4 flex flex-col'>
                <span>Você ainda nao possui nenhum imovel a venda.</span>
                <a href="/add-property" className="underline">Anuncie aqui</a>
            </div>
        :       
            <div className='mr-4 flex flex-1 justify-center flex-wrap'>
                {properties.map(property => {
                    return (
                        <div key={property.property.id} className='py-4 m-2'>
                            <img
                                src={property.images[0].imageUrl}
                                alt=''
                                className='h-[280px] w-[420px] rounded-lg object-cover'
                            />
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
                                <a href={`/my-properties/delete/${property.property.id}`} className='flex hover:text-red-600 items-center'>
                                    <MdDeleteOutline />
                                    Excluir
                                </a>
                            </div>
                            <div className="border-2 flex flex-1 border-gray-500 mb-2"></div>
                        </div>        
                    )
                })}
            </div>
        }
        </>
    )
}


