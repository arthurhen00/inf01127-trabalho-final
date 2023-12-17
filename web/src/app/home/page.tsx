import { cookies } from 'next/headers'
import { getUser } from '@/lib/auth'

import Header from '@/components/Header'
import Menu from '@/components/Menu'
 
export default function Home() {
  const isAuthenticated = cookies().has('token')

  const { name, email } = getUser()

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
