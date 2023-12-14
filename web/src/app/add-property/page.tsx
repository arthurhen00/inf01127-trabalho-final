

import { getUser } from '@/lib/auth'
import Header from '@/components/Header'
import AddPropertyForm from '@/components/AddPropertyForm'


export default function AddPropertyPage() {

    const { name, email } = getUser()

    return(
        <>
            <Header userName={name}/>
            <AddPropertyForm/>
        </>
        
    )
}


