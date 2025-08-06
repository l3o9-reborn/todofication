import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

// This tells Vercel to run this every minute
export const config = {
  schedule: '* * * * *', // every minute
};

export async function GET() {
  try {
    const nowUtc = dayjs().utc();
    console.log(nowUtc);

    console.log(nowUtc)

    // Fetch all users with notification enabled and their settings & due tasks
    const users = await prisma.user.findMany({
      where: {
        settings: {
          ne: true,
        },
      },
      include: {
        settings: true,
        tasks: {
          where: {
            status: 'Due',
          },
        },
      },
    });

    for (const user of users) {
      if (!user.email || user.tasks.length === 0) continue;

      // Get user's timezone or fallback to UTC
      const tz = user.settings?.timezone || 'UTC';

        const nowLocal = nowUtc.tz(tz).format('HH:mm');
        const preferredTime = dayjs(`2000-01-01T${user.settings?.nt}`).format('HH:mm');

        if (nowLocal === preferredTime)
        {
        const taskList = user.tasks.map(t => `- ${t.name}`).join('\n');
        const message = `Here are your due tasks:\n\n${taskList}`;

        await sendEmail({
          to: user.email,
          subject: 'Your Daily Task Summary',
          text: message,
        });
      }
    }

    return NextResponse.json({ message: 'Notifications sent' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
