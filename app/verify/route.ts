import { NextResponse } from "next/server"
import {prisma } from '@/lib/prisma'
import { createSession } from "@/lib/session"


export async function GET(req: Request){
    const {searchParams}= new URL(req.url)
    const token = searchParams.get('token')

    if(!token)
        return NextResponse.redirect(new URL('/auth/magic-link?status=error', req.url))

    const record= await prisma.verificationToken.findUnique({
        where:{
            token
        }
    })

    if(!record || record.expires < new Date())
        return NextResponse.redirect(new URL('/auth/magic-link?status=error', req.url))

    //create or update user
    const user= await prisma.user.upsert({
        where:{
            email:record.identifier
        },
        update:{},
        create:{email:record.identifier}
    })

    //delete the token 

    await prisma.verificationToken.delete({
        where:{
            id:record.id
        }
    })

    //create session + cookies 

    await createSession(user.id)
    return NextResponse.redirect(new URL('/', req.url))

}