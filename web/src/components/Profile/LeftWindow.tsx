'use client'

import { useEffect, useState } from 'react'
import Cookie from 'js-cookie'
import ShowProfileInfo from './ShowProfileInfo'
import { api } from '@/lib/api'
import EditProfileForm from './EditProfileForm'
import axios from 'axios'

type LeftStatus = 'view' | 'edit'

export default function LeftWindow() {
    const [leftStatus, setLeftStatus] = useState<LeftStatus>('view')  
    const [user, setUser] = useState<User>()
    const [city, setCity] = useState<any>()

    useEffect(() => {
        handleUser()
        handleCity()
    }, [])

    function handleLeftWindow(status : LeftStatus) {
        setLeftStatus(status)
        handleUser()
    }

    async function handleUser() {
        const token = Cookie.get('token')

        const response = await api.get('/user', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const user = response.data
        setUser(user)
    }

    async function handleCity() {
        const response = await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/regioes/4/municipios')
        const city = response.data.map((cidade : any) => cidade.nome)
        setCity(city)
    }

    return (
        
        <div className='px-4'>
            {/** menu */}
            <div className='flex justify-between'>
                { leftStatus == 'view' ? (
                    <span className='mb-2'>Informações do perfil</span>
                ) : (
                    <span className='mb-2'>Edição do perfil</span>
                )}
                
                <div>    
                { leftStatus == 'view' ? (
                    <span 
                        className='hover:cursor-pointer hover:underline hover:text-gray-400' 
                        onClick={() => handleLeftWindow('edit')} 
                    >
                        Editar
                    </span>
                ) : (
                    <span 
                        className='hover:cursor-pointer hover:underline hover:text-gray-400' 
                        onClick={() => handleLeftWindow('view')}
                    >
                        Voltar
                    </span>
                )}
                </div>
            </div>

            { leftStatus == 'view' && city && user ? (
                <ShowProfileInfo user={user} city={city}/>
            ) : city && user && (
                <EditProfileForm user={user} city={city}/>
            )}
            
        </div>
        
    )
}
