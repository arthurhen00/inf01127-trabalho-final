'use client'
import ImageCaroussel from '@/components/ImageCaroussel'
import { api } from '@/lib/api';
import { FormEvent, useEffect, useState } from 'react'
import Cookie from 'js-cookie'
import { jwtDecode } from 'jwt-decode';
import { IMaskInput } from 'react-imask';
import { CiSearch } from "react-icons/ci";
import axios from 'axios';
import { toast, ToastContainer} from 'react-toastify';
import Alert from '@/components/Alert';


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
  
const Explorer: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([])
  const [city, setCity] = useState<string[]>([])
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
  const [currentProperty, setCurrentProperty] = useState<Property>(properties[0]);

  // Propriedades iniciais
  async function handleProperties() {
    const token = Cookie.get('token')

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
    )
    setProperties(properties)
    setCurrentProperty(properties[currentPropertyIndex])
  }

  // cidades
  async function handleCity() {
    const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/regioes/4/municipios')
    const city = response.data.map((cidade : any) => cidade.nome)
    setCity(city)
  }

  const [options, setOptions] = useState<string[]>(city)
  const [select, setSelect] = useState('')

  // filtra a lista de cidades
  const handleInputChange = (e : any) => {
      const filtro = e.target.value.toLowerCase();
      const opcoesFiltradas = city.filter(opcao =>
        opcao.toLowerCase().includes(filtro)
      );
  
      setOptions(opcoesFiltradas);
      setSelect(filtro);
  }

  useEffect(() => {
    handleProperties()
    handleCity()
  }, [])

  // atualiza as propriedades segundo o filtro
  async function handlePropertiesFilter(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const numBedRoom = formData.get('numBedRoom') as string | null
    const numBathRoom = formData.get('numBathRoom') as string | null
    const minValue = formData.get('minValue') as string | null
    const maxValue = formData.get('maxValue') as string | null
    const city = formData.get('city') as string | null

    // Converte os valores para números, se existirem
    const parsedNumBedRoom = numBedRoom ? parseInt(numBedRoom, 10) : undefined
    const parsedNumBathRoom = numBathRoom ? parseInt(numBathRoom, 10) : undefined
    const parsedMinValue = minValue ? parseFloat(minValue) : undefined
    const parsedMaxValue = maxValue ? parseFloat(maxValue) : undefined

    const token = Cookie.get('token')
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
    )

    // Filtra as propriedades com base nos valores fornecidos
    const filteredProperties = properties.filter(property => {
      return (
        (!parsedNumBedRoom || property.numBedroom === parsedNumBedRoom) &&
        (!parsedNumBathRoom || property.numBathroom === parsedNumBathRoom) &&
        (!parsedMinValue || property.price >= parsedMinValue) &&
        (!parsedMaxValue || property.price <= parsedMaxValue) &&
        (!city || property.city == city)
      )
    })

    setProperties(filteredProperties)
    setCurrentProperty(filteredProperties[0])
  }

  // Proxima propriedade
  const handleNextProperty = async (isLiked : Boolean) => {
    const nextIndex = (currentPropertyIndex + 1) % properties.length;
    setCurrentPropertyIndex(nextIndex);
    setCurrentProperty(properties[nextIndex])

    const token = Cookie.get('token')!
    const { sub } = jwtDecode(token)

    await api.post('/user/history', {
      userId: sub,
      propertyId: currentProperty.id,
      isLiked: isLiked,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
  };

  // Curtir uma propriedade
  async function handleMatchRequest() {
    const token = Cookie.get('token')

    const match = await api.get('/matchRequest/exist', {
      params: {
        receiverId: currentProperty.userId,
        propertyId: currentProperty.id,
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const matchExist = match.data

    if(matchExist.length > 0){
      Alert('Você já curtiu esse imóvel!');
    }
    else{
    const matchRequest = await api.post('/matchRequest', {
      receiverId: currentProperty.userId,
      propertyId: currentProperty.id,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    handleNextProperty(true)
  }

  }

  return (

    <div className='flex flex-col items-center'>
    <ToastContainer /> 
      {/** Filtro */}
      <form onSubmit={handlePropertiesFilter} className='bg-white flex p-2 rounded-full mb-4'>
        <div className='bg-white rounded-xl flex items-center mr-2 ml-2'>
          <div className="bg-white w-48 p-2 rounded-xl mb-2 flex flex-col">
              <input
                  type="text"
                  value={select}
                  onChange={handleInputChange}
                  placeholder="Cidade: "
                  className="bg-white outline-none text-sm ml-1"
              />
              <select 
                  value={select} onChange={(e) => setSelect(e.target.value)}
                  name='city'
                  className="bg-white outline-none"
              >
                  {options.map((opcao, index) => (
                  <option  key={index} value={opcao}>
                      {opcao}
                  </option>
                  ))}
              </select>
          </div>
        </div>

        <div className='mr-2'>
          <div className='bg-white rounded-xl flex items-center justify-between'>
            <label htmlFor="numBedRoom" className="text-sm text-gray-600 ml-2">Quartos:</label>
            <div className="w-14 p-2 flex items-center ">
              <select name="numBedRoom" id="numBedRoom" className="bg-white outline-none text-sm flex-1">
                  <option value="any"></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3+</option>
              </select>
            </div>
          </div>

          <div className='bg-white rounded-xl flex items-center justify-between'>
            <label htmlFor="numBathRoom" className="text-sm text-gray-600 ml-2">Banheiros:</label>
            <div className="w-14 p-2 flex items-center ">
              <select name="numBathRoom" id="numBathRoom" className="bg-white outline-none text-sm flex-1">
                  <option value="any"></option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3+</option>
              </select>
            </div>
          </div>
        </div>

        <div className='mr-2'>
          <div className='bg-white rounded-xl flex items-center justify-between'>
            <label htmlFor="minValue" className="text-sm text-gray-600 ml-2">Valor Mínimo:</label>
            <div className="w-24 p-2 flex items-center ">
            <IMaskInput
                mask={Number}
                radix="."
                name="minValue"
                id="minValue"
                className="bg-white outline-none text-sm w-20"
            />
            </div>
          </div>

          <div className='bg-white rounded-xl flex items-center justify-between'>
            <label htmlFor="maxValue" className="text-sm text-gray-600 ml-2">Valor Máximo:</label>
            <div className="w-24 p-2 flex items-center ">
            <IMaskInput
                mask={Number}
                radix="."
                name="maxValue"
                id="maxValue"
                className="bg-white outline-none text-sm w-20"
            />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="border-2 border-white rounded-full p-2 inline-block text-black hover:text-gray-400">
          <CiSearch className="w-6 h-6" />
        </button>

      </form>
      {
        properties.length == 0 ?
          <span>Desculpe, não encontramos nenhum imóvel.</span>
        :
          <>
            <div className='w-1/2 flex flex-col'>
              <ImageCaroussel key={currentPropertyIndex} images={currentProperty.images} />
              <div className='text-pink-600 self-end'>
                <button onClick={() => { handleNextProperty(false) }} >Próximo Imóvel</button>
                <button onClick={handleMatchRequest} className='ml-4'>Curtir</button>
              </div>
            </div>

            <div className='flex flex-col w-1/2 text-sm items-center'>
              <div className="mb-2 text-lg">
                <span>{currentProperty.name}</span>
                {', '}
                <span>{currentProperty.city}</span>
                {' - '}
                <span>{currentProperty.state}</span>
              </div>

              <div className="mb-2">
                {currentProperty.propertyType === 'house' ? <span>Casa</span> : <span>Apartamento</span>}
                {' . '}
                {currentProperty.numBedroom > 1 ?
                  <span>{currentProperty.numBedroom} quartos</span> :
                  <span>{currentProperty.numBedroom} quarto</span>
                }
                {' . '}
                {currentProperty.numBathroom > 1 ?
                  <span>{currentProperty.numBathroom} banheiros</span> :
                  <span>{currentProperty.numBathroom} banheiro</span>
                }
                {' - '}
                <span>R$ </span>
                <span>{currentProperty.price}</span>
              </div>

              <div className="mb-2 text-justify">
                <span>{currentProperty.description}</span>
              </div>
                        
            </div>
          </>
      }

    </div>
  );
};
  
export default Explorer;