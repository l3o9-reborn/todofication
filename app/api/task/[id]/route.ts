import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getUserFromSession } from '@/lib/session'


export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const {id }=await context.params
    const user = await getUserFromSession()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { name, description, deadline, sendNotification, status} = await request.json()
    
    const newTask = await prisma.task.update({
        where:{id},
        data: {
            name,
            description,
            deadline: new Date(deadline),
            sendNotification,
            status,
            user: { connect: { id: user?.id } }, // Assuming userId is provided
      },
    })
    
    return NextResponse.json(newTask)
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: {params:Promise<{ id: string }>}) {
  try {
    const {id}=await context.params
    
    const deletedTask = await prisma.task.delete({
      where: { id },
    })
    
    return NextResponse.json(deletedTask)
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 })
  }
}