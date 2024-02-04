import { cookies } from 'next/headers'
import Header from '@/components/Header'
import Menu from '@/components/Menu'
import Unauthenticated from '@/components/Unauthenticated'
import { api } from "@/lib/api"
import ImageCaroussel from '@/components/ImageCaroussel'
 
export default async function Home() {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return (<Unauthenticated />)
  }

  const token = cookies().get('token')?.value

  const imageResponse = await api.get('/images/list', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  const images = imageResponse.data
  console.log('images:', images)
  

  return (
      <div className='flex flex-col h-screen bg-gray-100 max-h-screen '>        
        <Header />
        {/** Menu */}
        <Menu />

        <main className='bg-gray-100 px-24 relative w-screen h-full'>

          <div className='fixed left-0'>
            <ImageCaroussel images={images} customClassName ={'object-cover  h-2/3'} autoPlay={true} showArrows={false}/>
          </div>

          <div className='fixed left-0 bg-black opacity-60 w-screen h-full'/>
          <div className='flex flex-col justify-center h-full w-full align-center'>
            <div className='z-10 ml-auto mr-auto text-center text-white text-8xl'>
              SwipeHome
            </div>
            <div className='z-10 ml-auto mr-auto text-center text-white text-2xl mt-8'>
              Encontre seu lugar aqui
            </div>
          </div>
          
          
          
          
        </main>
      </div>
  )
}
