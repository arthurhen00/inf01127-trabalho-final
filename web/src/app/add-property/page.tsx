import Header from '@/components/Header'
import AddPropertyForm from '@/components/AddPropertyForm'
import Menu from '@/components/Menu'

export default function AddPropertyPage() {

    return(
    <div className='flex flex-col h-screen bg-gray-100'>        
        <Header />
        <Menu />

        <main className='bg-gray-100 px-24'>
          <AddPropertyForm />
        </main>
      </div>
    )
}


