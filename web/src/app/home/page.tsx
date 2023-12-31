import { cookies } from 'next/headers'
import Header from '@/components/Header'
import Menu from '@/components/Menu'
import Unauthenticated from '@/components/Unauthenticated'
 
export default function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return (<Unauthenticated />)
  }

  return (
      <div className='flex flex-col h-screen bg-gray-100'>        
        <Header />
        {/** Menu */}
        <Menu />

        <main className='bg-gray-100 px-24'>
          home content
        </main>
      </div>
  )
}
