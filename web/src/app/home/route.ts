import { api } from "@/lib/api";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    const registerResponse = await api.post('/register')
    
    //const { token } = registerResponse.data
    
    //console.log('funciona pfv: ', token)

    return new NextResponse('Hello, world!');
}