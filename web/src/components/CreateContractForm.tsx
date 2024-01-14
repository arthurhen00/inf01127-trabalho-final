'use client'

import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import { useRouter } from "next/navigation"
import { FormEvent, useEffect, useState } from "react"
import { IMaskInput } from "react-imask"

export default function CreateContractForm(props : { property : Property, matchId : string | string[] | undefined }) {
    const router = useRouter()

    const property = props.property
    const matchId = props.matchId

    const [contract, setContract] = useState<Contract>()

    useEffect(() => {
        handleContractForm()
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
            setContract(contract)
        } catch (e) {
            //
        }
    }

    async function submitContract(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)

        const token = Cookie.get('token')

        const contract = await api.post('/match/contract', {
            matchId: matchId,
            contractType: formData.get('contract-type'),
            price: parseFloat(formData.get('price')?.toString() ?? '0')
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        router.push('/match')
    }

    return (
        <form onSubmit={submitContract}>
            <label htmlFor="contract-type" className="text-sm text-gray-600 mb-1 ml-2">Tipo de transação</label>
            <div className="bg-white w-52 p-2 flex items-center mb-3 rounded-xl">
                <select 
                    name="contract-type" 
                    id="contract-type"  
                    className="bg-white outline-none text-sm flex-1"
                    defaultValue={contract?.contractType}    
                >
                    <option value="Sale">Compra</option>
                    <option value="Rent">Aluguel</option>
                </select>
            </div>

            <label htmlFor="price" className="text-sm text-gray-600 mb-1 ml-2">Valor acordado</label>
            <div className="bg-white w-52 p-2 flex items-center mb-3 rounded-xl">
                <IMaskInput
                    mask={Number}
                    radix="."
                    lazy={false}
                    unmask={true}
                    inputMode="numeric"
                    pattern="R$ num"
                    name="price"
                    id="price"
                    placeholder="R$ 0,00"
                    className="bg-white outline-none text-sm flex-1"
                    defaultValue={contract?.price || property.price}
                />
            </div>

            <button type="submit"
                    className="border-2 border-white rounded-full px-8 py-2 inline-block font-semibold hover:bg-white mb-4">
                Gerar contrato
            </button>
        </form>
    )
    
  }
  