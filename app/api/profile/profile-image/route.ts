import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getUserFromSession } from "@/lib/session"

export async function POST(req: Request){
    const user= await getUserFromSession()
    if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const {imageUrl}=await req.json()

    try {
        const updatedImage=await prisma.user.update({
        where:{id:user.id},
        data:{
            profileImage:imageUrl
        }
    })
     return NextResponse.json(updatedImage)
    } catch (error) {
        const err= error as Error
        console.log(err)
        return NextResponse.json(`Error Updating Profile Image`)
    }
}