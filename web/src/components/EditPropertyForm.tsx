'use client'

import { api } from "@/lib/api"
import { useEffect, useState } from "react"

export default function EditPropertyForm(props : { propertyId: string | string[] | undefined, token: string | undefined }) {

    const [property, setProperty] = useState<any>()

    useEffect(() => {
        const property = handlePropertyForm()

        setProperty(property)
        console.log(property)
    }, [])


    async function handlePropertyForm() {
        const propertyResponse = await api.get(`/properties/${props.propertyId}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        const propertyData = propertyResponse.data
        
        const imageResponse = await api.get(`/images/${props.propertyId}`, {
            headers: {
                Authorization: `Bearer ${props.token}`
            }
        })
        const imageData = imageResponse.data
        
        const property = { propertyData, imageData }

        return property
    }

    return(
        <div>
            Edit page, Form
        </div>
    )
}