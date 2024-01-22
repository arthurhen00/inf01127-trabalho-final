'use client'

import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useEffect, useState } from "react"

interface Users {
    receiver: User
    requester: User
}

export default function ShowContract(props : { property : Property, matchId : string | string[] | undefined }) {

    const property = props.property
    const matchId = props.matchId

    const [contract, setContract] = useState<Contract>()
    const [users, setUsers] = useState<Users>()

    useEffect(() => {
        const contract = handleContractForm()
        
        contract.then((res) => {
            setContract(res)
        })

        handleUsers()
    }, [])

    async function handleContractForm() {
        const token = Cookie.get('token')
        
        try {
            const contractResponse = await api.get(`/contract/match/${matchId}`, {
                headers: {
                    Authorization: `Bearer ${token}`    
                }
            })
            const contract = contractResponse.data
            return contract
        } catch (e) {
            //
        }
    }

    async function handleUsers() {
        const token = Cookie.get('token')
        
        const matchResponse = await api.get(`/matchRequest/${matchId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const match = matchResponse.data

        const requesterResponse = await api.get(`/user/${match.requesterId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const requester = requesterResponse.data

        const receiverResponse = await api.get(`/user/${match.receiverId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const receiver = receiverResponse.data
        const users = {receiver, requester}

        setUsers(users)
    }

    return (
        
        <div>
            { !users ? 
                (<>Carregando...</>) 
            :
                (
                <>
                <div>
                    <span className="text-base font-bold">Nome do anúncio:</span>
                    {' '}
                    <span>{property.name}</span>
                </div>

                <div>
                    <span className="text-base font-bold">Endereço da propriedade:</span>
                    {' '}
                    <span>
                        {property.address}
                        {', '}
                        {property.city}
                        {', '}
                        {property.state}
                        {' - '}
                        {property.zipcode}
                    </span>
                </div>

                <div>
                    <span className="text-base font-bold">Informações do imóvel:</span>
                    {' '}
                    <span>
                        {property.propertyType == 'house' ? <>Casa</> : <>Apartamento</>}
                        {', Nº '}
                        {property.propertyNumber}
                    </span>
                </div>

                <div>
                    <span className="text-base font-bold">Tipo de transação: </span>
                    {' '}
                    {contract?.contractType === 'Rent'  ? <span>Aluguel</span> : <span>Compra</span>}
                </div>

                <div>
                    <span className="text-base font-bold">Valor anunciado:</span>
                    {' '}
                    <span>{property.price}</span>
                </div>

                <div>
                    <span className="text-base font-bold">Valor acordado: </span>
                    {' '}
                    <span>{contract?.price}</span>
                </div>

                <div>
                    <span className="text-base font-bold">Vendedor:</span>
                    {' '}
                    <span>{users.receiver.name}</span>
                    {' - '}
                    <span>{users.receiver.email}</span>
                </div>

                <div>
                    <span className="text-base font-bold">Comprador:</span>
                    {' '}
                    <span>{users.requester.name}</span>
                    {' - '}
                    <span>{users.requester.email}</span>
                </div>
            </>)
        }
        </div>
    )
    
  }
  