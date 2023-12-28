'use client'
import ImageCaroussel from '@/components/ImageCaroussel'
import { useState } from 'react'

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
  
    const handleNextProperty = () => {
      const nextIndex = (currentPropertyIndex + 1) % properties.length;
      setCurrentPropertyIndex(nextIndex);
    };
  
    return (
      <div className='h-full flex flex-col items-center '>
        <h2>{currentProperty.name}</h2>
        <ImageCaroussel key={currentPropertyIndex} images={currentProperty.images} />
        <div className='flex items-center w-3/5 justify-evenly'>
          <button >Curtir</button>
          <button onClick={handleNextProperty}>Próximo Imóvel</button>
        </div>
        
      </div>
    );
  };
  
  export default Explorer;