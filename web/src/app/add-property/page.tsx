import Header from '@/components/Header'
import AddPropertyForm from '@/components/AddPropertyForm'
import Menu from '@/components/Menu'
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';


export default function AddPropertyPage() {

    return(
    <div className='flex flex-col h-screen bg-gray-100'>      
    <ToastContainer/>  
        <Header />
        <Menu />

        <main className='bg-gray-100 px-24'>
          <AddPropertyForm />
        </main>
      </div>
    )
}


