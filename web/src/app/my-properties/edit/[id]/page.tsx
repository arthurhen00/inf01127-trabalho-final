import EditPropertyForm from "@/components/EditPropertyForm";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Unauthenticated from "@/components/Unauthenticated";
import { GetServerSidePropsContext } from "next";
import { cookies } from "next/headers";

export default function PropertyEdit(context: GetServerSidePropsContext) {
  const isAuthenticated = cookies().has('token')

  if (!isAuthenticated) {
    return (<Unauthenticated />)
  }

  const propertyId = context.params?.id
  const token = cookies().get('token')?.value

  return(
    <div className='flex flex-col h-screen bg-gray-100'>
      <Header />
      <Menu />

      <main className='bg-gray-100 px-24'>
        <EditPropertyForm propertyId={propertyId} token={token} />
      </main>
    </div>
  )
}