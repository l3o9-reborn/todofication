import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getUserFromSession } from "@/lib/session"

export async function PUT(req: Request){
    const user= await getUserFromSession()
    if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const {profileImage, coverImage, name, email, bio}=await req.json()

    try {
        const updatedProfile=await prisma.user.update({
        where:{id:user.id},
        data:{
            profileImage,
            coverImage,
            name,
            email,
            bio
        }
    })
     return NextResponse.json(updatedProfile)
    } catch (error) {
        const err= error as Error
        console.log(err)
        return NextResponse.json(`Error Updating Profile`)
    }
}


export async function GET(){
    try {
         const user= await getUserFromSession()
            if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            const profileData=await prisma.user.findUnique({
                where:{id:user.id }
            })
            return NextResponse.json(profileData)
    } catch (error) {
        const err= error as Error
        console.log(err)
        return NextResponse.json(`Error Fetching Profile`)
    }
}