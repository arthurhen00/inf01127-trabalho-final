'use client'

import { useEffect, useState } from 'react'
import ShowPurschasedProperties from './ShowPurchasedProperties'
import ShowSoldProperties from './ShowSoldProperties'
import { api } from '@/lib/api'
import Cookie from 'js-cookie'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import dayjs from 'dayjs'

type RightStatus = 'sold' | 'purchased'

export default function RightWindow() {
    const [rightStatus, setRightStatus] = useState<RightStatus>('sold')  

    function handleRightWindow(status : RightStatus) {
        setRightStatus(status)
    }

    const [purchasedProperties, setPurschasedProperties] = useState<NegotiatedProperty[]>([])
    const [soldProperties, setSoldProperties] = useState<NegotiatedProperty[]>([])

    useEffect(() => {
        handlePurchasedProperties()
    }, [])

    async function handlePurchasedProperties(){
        const token = Cookie.get('token')
        const purchasedResponse = await api.get('/properties/purchased', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const purchasedProperties = purchasedResponse.data
        setPurschasedProperties(purchasedProperties)

        const soldResponse = await api.get('/properties/sold', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const soldProperties = soldResponse.data
        setSoldProperties(soldProperties)
    }

    function createPDF(data : NegotiatedProperty[]) {
        const doc = new jsPDF()

        doc.text('Relatório de ', 10, 10);
        //doc.text('Vendas', 10, 30);

        let body : any = []
        for (const item of data) {
            const rowData = ['v',
                             'c',
                             item.propertyData.name, 
                             dayjs(item.propertyData.createdAt).format('D[/]MM[/]YY'),
                             'R$ ' + item.propertyData.price, 
                             dayjs(item.propertyData.createdAt).format('D[/]MM[/]YY'),
                             'R$ ' + item.contractData.price,
                            ]
            body.push(rowData)
        }

        console.log(body)
        
        autoTable(doc, {
            head: [['Vendedor',
                    'Comprador',
                    'Anúncio', 
                    'Data de criação', 
                    'Valor do anúncio',
                    'Data de venda',
                    'Valor acordado',
                ]],
            body: body,
        })

        const pdfBlob = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    }

    return (
        
        <div className='px-4 flex flex-col flex-1'>
            {/** menu */}
            <div className='flex justify-between'>
                <div className='flex justify-around flex-1'>
                    <span 
                        className='hover:cursor-pointer ' 
                        onClick={() => handleRightWindow('sold')} 
                    >
                        { rightStatus == 'sold' ? (
                            <span className='underline'>Propriedades vendidas</span>
                        ) : (
                            <span className='hover:text-gray-400 hover:underline'>Propriedades vendidas</span>
                        )}
                    </span>
                    <span 
                        className='hover:cursor-pointer' 
                        onClick={() => handleRightWindow('purchased')}
                    >
                        { rightStatus == 'purchased' ? (
                            <span className='underline'>Propriedades compradas</span>
                        ) : (
                            <span className='hover:text-gray-400 hover:underline'>Propriedades compradas</span>
                        )}
                    </span>
                </div>
            </div>

            
                { rightStatus == 'purchased' && purchasedProperties  ? (
                    <>
                        <ShowPurschasedProperties data={purchasedProperties} />
                        <button 
                            className='self-end'
                            onClick={() => {createPDF(purchasedProperties)}}
                        >
                            Gerar relatorio de compra
                        </button>
                    </>
                ) :  (
                    <>
                        <ShowSoldProperties data={soldProperties}/>
                        <button 
                            className='self-end'
                            onClick={() => {createPDF(soldProperties)}}
                        >
                            Gerar relatorio de venda
                        </button>
                    </>
                )}
            

            
            
        </div>
        
    )
}
