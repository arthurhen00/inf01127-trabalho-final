'use client'
import ImageCaroussel from '@/components/ImageCaroussel'
import { api } from '@/lib/api';
import { useState } from 'react'
import Cookie from 'js-cookie'
import { jwtDecode } from 'jwt-decode';

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

interface ExplorerProps {
    properties: Property[];
  }
  


  const Explorer: React.FC<ExplorerProps> = ({ properties }) => {
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
    const currentProperty = properties[currentPropertyIndex];
  
    // TODO
    // mudar mais tarde para nao ser circular, ao chegar ao fim mostrar 'Sem imoveis' algo assim
    const handleNextProperty = async (isLiked : Boolean) => {
      const nextIndex = (currentPropertyIndex + 1) % properties.length;
      setCurrentPropertyIndex(nextIndex);

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

    async function handleMatchRequest() {
      const token = Cookie.get('token')!
      const { sub } = jwtDecode(token)

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
  
    return (
      <div className='flex flex-col items-center'>

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
            <span>{currentProperty.price}</span>
            <span> Reais</span>
          </div>

          <div className="mb-2 text-justify">
            <span>{currentProperty.description}</span>
          </div>
                    
        </div>

      </div>
    );
  };
  
  export default Explorer;