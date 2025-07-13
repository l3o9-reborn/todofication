import crypto from 'crypto'
import {prisma} from '@/lib/prisma'
import {addMinutes} from 'date-fns'


export async function createVerificationToken(email: string){
    const token = crypto.randomBytes(32).toString('hex')  //64-chat
    const expires=addMinutes(new Date(), 15) //15 min TTL
    await prisma.verificationToken.create({
        data:{
            identifier:email,
            token,
            expires
        }
    })

    return token
}