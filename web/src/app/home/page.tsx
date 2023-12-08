import { cookies } from 'next/headers'
import { getUser } from '@/lib/auth'

import { BiBuildingHouse } from "react-icons/bi";
import { PiHouseLineBold } from "react-icons/pi";
import { RxExit } from "react-icons/rx";
import { FaRegUser } from 'react-icons/fa';

export default function Home() {
  const isAuthenticated = cookies().has('token')

  const { name, email } = getUser()

  return (
      <>
        {/** Header */}
        <div className='bg-gray-300 flex flex-row justify-between px-24 py-4 border-b-2 border-gray-200'>
          <div className='flex items-center'>
            <BiBuildingHouse className="w-10 h-10"/>
            <PiHouseLineBold className="w-6 h-6"/>
            <h1 className='text-2xl leading-relaxed font-bold'>Swipehome</h1>
          </div>
          <div>
            <p className='text-sm leading-snug flex items-center'>
              <FaRegUser className="mr-1" />
              Bem vindo {name}
            </p>
            <a href='/' className='text-sm leading-snug text-red-800 hover:text-red-600 flex items-center'>
              <RxExit className="mr-1" />
              <span>Quero sair</span>
            </a>
          </div>
        </div>

        {/** Menu */}
        <div className='flex px-24 py-2 justify-center bg-gray-300 '>
            <a href='' className='px-6 py-2 border-b-2 border-gray-300 hover:border-gray-200'>Perfil</a>
            <a href='' className='px-6 py-2 border-b-2 border-gray-300 hover:border-gray-200'>Buscar</a>
            <a href='' className='px-6 py-2 border-b-2 border-gray-300 hover:border-gray-200'>Minhas propriedades</a>
        </div>

        <main className='bg-gray-200'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Et alias deleniti repudiandae minima sit a modi maxime reiciendis ut omnis velit, cumque laborum amet soluta ipsum excepturi facilis nisi. Optio?
        </main>
      </>
  )
}
