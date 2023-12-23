import { api } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'url';

export async function GET(request: NextRequest) {
    const redirectURL = new URL('/my-properties', request.url)

    const { query } = parse(request.url, true)
    const id = query?.id

    const imageResponse = await api.delete(`/images/${id}`)

    const token = cookies().get('token')?.value

    const response = await api.delete(`/properties/${id}`, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    })

    return NextResponse.redirect(redirectURL)
}
