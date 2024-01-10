import EditPropertyForm from "@/components/EditPropertyForm";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Unauthenticated from "@/components/Unauthenticated";
import Unauthorized from "@/components/Unauthorized";
import { api } from "@/lib/api";
import { getUser } from "@/lib/auth";
import { GetServerSidePropsContext } from "next";
import { cookies } from "next/headers";

export default async function PropertyEdit(context: GetServerSidePropsContext) {
  const isAuthenticated = cookies().has('token')
  const { sub } = getUser()

  if (!isAuthenticated) {
    return (<Unauthenticated />)
  }

  const propertyId = context.params?.id
  const token = cookies().get('token')?.value

  const propertyResponse = await api.get(`/properties/${propertyId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
  })
  const propertyData : Property = propertyResponse.data

  if( propertyData.userId != sub ) {
    return (<Unauthorized />)
  }

  return(
    <div className='flex flex-col h-screen bg-gray-100'>
      <Header />
      <Menu />

      <main className='bg-gray-100 px-24'>
        <EditPropertyForm propertyId={propertyId} />
      </main>
    </div>
  )
}