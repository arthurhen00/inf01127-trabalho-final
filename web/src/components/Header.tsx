import { BiBuildingHouse } from "react-icons/bi";
import { PiHouseLineBold } from "react-icons/pi";
import { RxExit } from "react-icons/rx";
import { FaRegUser } from 'react-icons/fa';
import { getUser } from "@/lib/auth";
import { name } from "tailwindcss";

export default function Header() {
  
  const { name, email } = getUser()

  return(
    <div className='bg-gray-100 flex flex-row justify-between px-24 py-4 border-b-2 border-gray-200'>
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
        <a href='/auth/logout' className='text-sm leading-snug text-red-800 hover:text-red-600 flex items-center'>
          <RxExit className="mr-1" />
          <span>Quero sair</span>
        </a>
      </div>
    </div>
  )
}