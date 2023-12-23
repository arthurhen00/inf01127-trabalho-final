import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { GetServerSidePropsContext } from "next";

export default function PropertyDetails(context: GetServerSidePropsContext) {

    const propertyId = context.params?.id

    return(
        <div className='flex flex-col h-screen bg-gray-100'>
          <Header />
          <Menu />
    
          <main className='bg-gray-100 px-24 flex'>
            Details Page
          </main>
        </div>
      )
}
