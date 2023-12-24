import EditPropertyForm from "@/components/EditPropertyForm";
import Header from "@/components/Header";
import Menu from "@/components/Menu";
import { GetServerSidePropsContext } from "next";
import { cookies } from "next/headers";

export default function PropertyEdit(context: GetServerSidePropsContext) {

  const propertyId = context.params?.id
  const token = cookies().get('token')?.value

  return(
    <div className='flex flex-col h-screen bg-gray-100'>
      <Header />
      <Menu />

      <main className='bg-gray-100 px-24 flex'>
        <EditPropertyForm propertyId={propertyId} token={token} />
      </main>
    </div>
  )
}