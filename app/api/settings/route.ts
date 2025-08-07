import {prisma} from '@/lib/prisma'
import { getUserFromSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function PUT(req: Request) {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { ae, ne } = await req.json();
  try {
    await prisma.settings.upsert({
      where: { userId: user.id },
      update: { ae, ne },
      create: { ae, ne, userId: user.id },
    });
    return NextResponse.json('Successfully Updated Settings', { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json('Error Updating Settings', { status: 500 });
  }
}

export async function GET() {
  const user = await getUserFromSession();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const settings = await prisma.settings.findUnique({ where: { userId: user.id } });
    return NextResponse.json(settings);
  } catch (error) {
    console.log(error);
    return NextResponse.json('Error Fetching Settings', { status: 500 });
  }
}
