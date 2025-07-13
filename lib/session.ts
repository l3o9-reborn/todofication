import { cookies } from "next/headers"
import {addDays} from 'date-fns'
import {prisma } from '@/lib/prisma'
import crypto from 'crypto'


const COOKIE_NAME='__session'
const SESSION_DAYS = 7
const COOKIE_OPTIONS ={
    httpOnly:true,
    path:'/',
    sameSite:'lax' as const ,
    secure: process.env.NODE_ENV === 'production'
}


export async function createSession(userId: string){
    const sessionId= crypto.randomUUID()
    const expires = addDays(new Date(), SESSION_DAYS)

    await prisma.session.create({
        data:{id:sessionId, userId, expires}
    })
    ;(await cookies()).set(COOKIE_NAME, sessionId, {...COOKIE_OPTIONS, expires})
}

export async function destroySession(){
    const sessionId =(await cookies()).get(COOKIE_NAME)?.value
    if(sessionId){
        await prisma.session.delete({
            where:{
                id:sessionId
            }
        })
        .catch(()=>{})
        ;(await cookies()).delete(COOKIE_NAME)
    }
}

export async function getUserFromSession(){
    const sessionId= (await cookies()).get(COOKIE_NAME)?.value
    if(!sessionId) return null
    const session = await prisma.session.findUnique({
        where:{
            id:sessionId,
            expires:{
                gt:new Date()
            }
        },
        include:{user: true},
    })

    return session?.user ?? null
}