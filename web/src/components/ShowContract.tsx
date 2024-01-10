'use client'

import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useEffect, useState } from "react"
import { IMaskInput } from "react-imask"

export default function ShowContract(props : { property : Property, matchId : string | string[] | undefined }) {

    const property = props.property
    const matchId = props.matchId

    const [contract, setContract] = useState<Contract>()

    useEffect(() => {
        const contract = handleContractForm()
        
        contract.then((res) => {
            setContract(res)
        })
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

    return (
        <div>
            <div className='flex'>
                <span>Tipo de transação: </span>
                {' '}
                {contract?.contractType === 'Rent'  ? <span>aluguel</span> : <span>compra</span>}
            </div>
            <div>
                <span>Valor acordado: </span>
                {' '}
                <span>{contract?.price}</span>
            </div>
        </div>
    )
    
  }
  