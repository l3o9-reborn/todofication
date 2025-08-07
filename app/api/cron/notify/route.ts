import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export const config = {
  schedule: '* * * * *', // every minute
};

interface DebugInfoEntry {
  user: string;
  timezone: string;
  localHour: number;
  localMinute: number;
  preferredHour: number;
  preferredMinute: number;
  tasksCount: number;
}

export async function GET() {
  try {
    const nowUtc = dayjs().utc();
    const debugInfo: DebugInfoEntry[] = [];

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
      if (!user.email || user.tasks.length === 0){
        console.log(user.email, user.tasks.length);
        continue;
      }
        

      const tz = user.settings?.timezone || 'UTC';
      const nowLocal = nowUtc.tz(tz);

      if (!user.settings?.nt) {
        console.log(`Skipping ${user.email} - No notification time`);
        continue;
      }
      console.log('everything working')

      const [hour, minute] = user.settings.nt.split(':').map(Number);

      debugInfo.push({
        user: user.email,
        timezone: tz,
        localHour: nowLocal.hour(),
        localMinute: nowLocal.minute(),
        preferredHour: hour,
        preferredMinute: minute,
        tasksCount: user.tasks.length,
      });

      if (
        nowLocal.hour() === hour &&
        nowLocal.minute() === minute
      ) {
        const taskList = user.tasks.map(t => `- ${t.name}`).join('\n');
        const message = `Here are your due tasks:\n\n${taskList}`;

        await sendEmail({
          to: user.email,
          subject: 'Your Daily Task Summary',
          text: message,
        });
      }
    }

    return NextResponse.json({ status: 'Notifications processed', debugInfo });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 });
  }
}
