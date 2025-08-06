import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET() {
  try {
    const nowUtc = dayjs().utc();

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

      // Current time in user's timezone formatted as HH:mm
      const nowLocal = nowUtc.tz(tz).format('HH:mm');

      // Check if current local time matches user preferred notification time
      if (nowLocal === user.settings?.nt) {
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
