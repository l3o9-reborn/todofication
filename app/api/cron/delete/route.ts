import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

interface DebugInfoEntry {
  userId: string;
  timezone: string;
  localHour: number;
  localMinute: number;
  preferredHour: number;
  preferredMinute: number;
}

dayjs.extend(utc);
dayjs.extend(timezone);

// Run every minute on Vercel
export const config = {
  schedule: '* * * * *', // every minute
};

export async function GET() {
  try {
    const nowUtc = dayjs().utc();
    let totalDeleted = 0;

    // Fetch users with auto-delete enabled
    const settings = await prisma.settings.findMany({
      where: {
        ae: true,
      },
    });

    const debugInfo: DebugInfoEntry[] = [] = []

    for (const s of settings) {
      const tz = s.timezone || 'UTC';

        const nowLocal = nowUtc.tz(tz);
        if (!s?.nt) continue;
        const [hour, minute] = s?.nt.split(':').map(Number)

      debugInfo.push({
        userId: s.userId,
        timezone: tz,
        localHour: nowLocal.hour(),
        localMinute: nowLocal.minute(),
        preferredHour: hour,
        preferredMinute: minute,
      })


        // Check if nowLocal is between scheduledTime and scheduledTime + 1 min
        if (
        nowLocal.hour() === hour &&
        nowLocal.minute() === minute  
        ){
          const deleted = await prisma.task.deleteMany({
          where: {
            userId: s.userId,
            deadline: { lt: nowUtc.toDate() }, // past deadline compared in UTC
          },
        });
        totalDeleted += deleted.count;
      }
    }

  return NextResponse.json({ status: 'Delete Processed', debugInfo, totalDeleted })
  } catch (error) {
    console.error('Task auto-clean error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-delete tasks' },
      { status: 500 }
    );
  }
}
