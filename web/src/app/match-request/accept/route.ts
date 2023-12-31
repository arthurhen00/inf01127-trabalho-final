import { api } from '@/lib/api';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'url';

export async function GET(request: NextRequest) {
    const redirectURL = new URL('/match-request', request.url)

    const { query } = parse(request.url, true)
    const id = query?.id 

    const token = cookies().get('token')?.value

    const response = await api.get(`/matchRequest/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    const match : MatchRequest = response.data

    /*await api.post('/match', {
        requesterId: match.requesterId,
        propertyId: match.propertyId,
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    await api.delete(`/matchRequest/${id}`, {
        headers: {
            Authorization: `Bearer ${token}` 
        }
    })*/

    await api.put(`/matchRequest/${id}`, {
        status: 'Accept'
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    
    return NextResponse.redirect(redirectURL)
}