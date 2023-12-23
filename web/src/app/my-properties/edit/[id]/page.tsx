import Header from "@/components/Header";
import Menu from "@/components/Menu";

export default function PropertyEdit() {
    return(
        <div className='flex flex-col h-screen bg-gray-100'>
          <Header />
          <Menu />
    
          <main className='bg-gray-100 px-24 flex'>
            Edit page
          </main>
        </div>
      )
}