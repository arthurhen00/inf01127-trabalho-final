import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'url';

export async function GET(request: NextRequest) {
    const redirectURL = new URL('/my-properties', request.url)
    const unauthorizedURL = new URL('/home', request.url)

    const { query } = parse(request.url, true)
    const id = query?.id // id da propriedade

    const token = cookies().get('token')?.value
    const { sub } = getUser()

    const propertyResponse = await api.get(`/properties/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    const propertiesData : Property = propertyResponse.data
    
    if( propertiesData.userId != sub ) {
        return NextResponse.redirect(unauthorizedURL)
    }

    const imagesToDeleteResponse = await api.get(`/images/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const imagesToDelete : Image[] = imagesToDeleteResponse.data

    const imagesName = imagesToDelete.map(image => {
        const imageId = image.imageId
        
        const regex = /\.([a-zA-Z0-9]+)$/
        const match = image.imageUrl.match(regex);
        const extension = match ? match[1] : ''

        const filename = imageId.concat('.' + extension)

        return filename
    })

    const imageResponse = await api.delete(`/images/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const response = await api.delete(`/properties/${id}`, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    })
    
    imagesName.forEach(async (imageName) => {
        const uploadDeleteResponse = await api.delete(`/upload/${imageName}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    })


    return NextResponse.redirect(redirectURL)
}
