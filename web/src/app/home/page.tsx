import { cookies } from 'next/headers'
import { getUser } from '@/lib/auth'

import Header from '@/components/Header'
 
export default function Home() {
  const isAuthenticated = cookies().has('token')

  const { name, email } = getUser()

  return (
      <>        
        <Header userName={name}/>
        {/** Menu */}
        <div className='flex px-24 py-2 justify-center bg-gray-100 '>
            <a href='' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Perfil</a>
            <a href='' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Buscar</a>
            <a href='' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Minhas propriedades</a>
            <a href='' className='px-6 py-2 border-b-2 border-gray-100 hover:border-gray-200'>Pedidos</a>
        </div>

        <main className='bg-gray-100 px-24'>
          main content here
        </main>
      </>
  )
}
