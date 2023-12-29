import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { api } from "@/lib/api";
import { GetServerSidePropsContext } from "next";
import { cookies } from "next/headers";

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

interface Image {
  imageUrl: string
}

export default async function PropertyDetails(context: GetServerSidePropsContext) {

  const propertyId = context.params?.id
  const token = cookies().get('token')?.value
  
  const propertyResponse = await api.get(`/properties/${propertyId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
  })

  const propertiesData : Property = propertyResponse.data

  const imageResponse = await api.get(`/images/${propertyId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  const images = imageResponse.data

  const property = { propertiesData, images }

  return(
    <div className='flex flex-col h-screen bg-gray-100'>
      <Header />
      <Menu />

      <main className='bg-gray-100 px-24 flex flex-col'>

        {/** Menu info */}
        <div className="flex flex-1 justify-between">
          <h1>{property.propertiesData.name}{', '}{property.propertiesData.state}</h1>
          <a href="/my-properties" className="text-black hover:text-gray-500">Voltar</a>
        </div>
        <div className="border-[1px] flex flex-1 border-gray-400 mb-2"></div>

        
        {/** Info box */}
        <div className="flex">
          <div className="w-1/3 text-sm leading-relaxed">
            <h1 className="text-2xl mb-4">Informações do cadastro</h1>
            <div className="mb-2">
              <span className="text-base font-bold">Nome do anúncio: </span>
              <span>{property.propertiesData.name}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">CEP: </span>
              <span>{property.propertiesData.zipcode}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Estado: </span>
              <span>{property.propertiesData.state}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Cidade: </span>
              <span>{property.propertiesData.city}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Endereço: </span>
              <span>{property.propertiesData.address}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Valor: </span>
              <span>{property.propertiesData.price}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Descrição: </span>
              <span>{property.propertiesData.description}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Tipo do imóvel: </span>
              <span>{property.propertiesData.propertyType}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Número: </span>
              <span>{property.propertiesData.propertyNumber}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Quantidade de quartos: </span>
              <span>{property.propertiesData.numBedroom}</span>
            </div>
            <div className="mb-2">
              <span className="text-base font-bold">Quantidade de banheiros: </span>
              <span>{property.propertiesData.numBathroom}</span>
            </div>
          </div>

          <div className='w-2/3'>
          <h1 className="text-2xl mb-4">Imagens enviadas</h1>
            <div className='flex flex-wrap justify-start'>
              {property.images.map((image : Image, index : number) => ( 
                <img
                  key={index}
                  src={image.imageUrl}
                  alt={`${index}`}
                  className='h-[140px] w-[280px] rounded-lg object-cover m-2'
                />
              ))}
                </div>
          </div>
        </div>


      </main>
    </div>
  )
}
