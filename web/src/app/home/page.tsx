import { cookies } from 'next/headers'
import { getUser } from '@/lib/auth'

export default function Home() {
  const isAuthenticated = cookies().has('token')

  const { name, email } = getUser()

  return (
      <main>
        {/** Header */}
        <div>
          Olá {name}, email: {email}
        </div>


        <button type="submit" className="border-2 border-blue rounded-full px-12 py-2 
                    inline-block font-semibold bg-slate-500">
          Sair
        </button>
      </main>
  )
}
