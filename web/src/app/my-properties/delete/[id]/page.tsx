import Header from "@/components/Header"
import Menu from "@/components/Menu"
import { GetServerSidePropsContext } from "next"
import { cookies } from "next/headers"

export default function PropertyDelete(context: GetServerSidePropsContext) {

    const propertyId = context.params?.id
    const token = cookies().get('token')?.value
    
    

    return(
        <div className='flex flex-col h-screen bg-gray-100'>
          <Header />
          <Menu />
    
          <main className='bg-gray-100 px-24 flex'>
            <div className="bg-yellow-200 flex flex-1 justify-between">
              <h1>nome</h1>
              <a href={`/my-properties/delete?id=${propertyId}`}>Confirmar e deletar</a>
            </div>
          </main>
        </div>
      )
}
