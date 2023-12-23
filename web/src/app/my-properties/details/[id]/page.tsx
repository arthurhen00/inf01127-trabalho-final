import Header from "@/components/Header";
import Menu from "@/components/Menu";

export default function PropertyDetails() {
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
