import Header from '@/components/Header'
import Menu from '@/components/Menu'
import LeftWindow from '@/components/Profile/LeftWindow'
import RightWindow from '@/components/Profile/RightWindow'
import Unauthenticated from '@/components/Unauthenticated'
import { cookies } from 'next/headers'
import { ToastContainer } from 'react-toastify'

export default function ProfilePage() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return (<Unauthenticated />)
  }

  return (
    
    <div className='flex flex-col h-screen bg-gray-100'>        
    <ToastContainer /> 
      <Header />
      <Menu />

      <main className='bg-gray-100 px-24'>
        <div className='flex items-center mb-4'>
          <h1 className='text-2xl font-bold'>Meu perfil</h1>
        </div>

        <div className='flex'>
          <div className='w-1/2'>
            <LeftWindow />
          </div>
          
          <div className='w-1/2'>
            <RightWindow />
          </div>
        </div>
      </main>
    </div>
  )
}
