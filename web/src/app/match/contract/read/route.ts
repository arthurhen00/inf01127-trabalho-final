import { api } from '@/lib/api';
import { getUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server'
import { parse } from 'url';

export async function GET(request: NextRequest) {
    const redirectURL = new URL('/match', request.url)
    const unauthorizedURL = new URL('/home', request.url)

    const { query } = parse(request.url, true)
    const id = query?.id // id do contrato

    const token = cookies().get('token')?.value
    const { sub } = getUser()

    const contractResponse = await api.get(`/match/contract/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const contract = contractResponse.data

    const matchResponse = await api.get(`/matchRequest/${contract.matchId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    const match = matchResponse.data

    if( match.requesterId != sub ) {
        return NextResponse.redirect(unauthorizedURL)
    }

    api.put(`/match/contract/${id}`, {
        
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return NextResponse.redirect(redirectURL)
}
