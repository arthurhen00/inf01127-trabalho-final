import Header from '@/components/Header'
import Menu from '@/components/Menu'
import Unauthenticated from '@/components/Unauthenticated'
import { cookies } from 'next/headers'
 
export default function ProfilePage() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return (<Unauthenticated />)
  }

  return (
    <div className='flex flex-col h-screen bg-gray-100'>        
      <Header />
      <Menu />

      <main className='bg-gray-100 px-24'>
        edit profile form
      </main>
    </div>
  )
}
