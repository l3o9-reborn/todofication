
import {prisma} from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getUserFromSession } from '@/lib/session'

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
        where: {
            user: {
                id: (await getUserFromSession())?.id
            }
        },
        orderBy: { createdAt: 'asc' }
    })
    return NextResponse.json(tasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }
}


export async function POST(request: Request) {
  try {
    const user = await getUserFromSession()
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
    const { name, description, deadline, sendNotification } = await request.json();

    const newTask = await prisma.task.create({
      data: {
        name,
        description,
        deadline: deadline ? new Date(deadline) : null,
        sendNotification,
        userId : user.id, // Use the authenticated user's ID
      },
    });

    return NextResponse.json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
  }
}
