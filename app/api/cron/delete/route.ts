import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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
        at: { not: null },
      },
    });

    for (const s of settings) {
      const tz = s.timezone || 'UTC';

      // Format user's scheduled time and current time to 'HH:mm'
      const userDeleteTime = dayjs(`2000-01-01T${s.at}`).format('HH:mm');
      const nowLocalTime = nowUtc.tz(tz).format('HH:mm');

      if (nowLocalTime === userDeleteTime) {
        const deleted = await prisma.task.deleteMany({
          where: {
            userId: s.userId,
            deadline: { lt: nowUtc.toDate() }, // past deadline compared in UTC
          },
        });
        totalDeleted += deleted.count;
      }
    }

    return NextResponse.json({
      message: 'Old tasks deleted successfully',
      count: totalDeleted,
    });
  } catch (error) {
    console.error('Task auto-clean error:', error);
    return NextResponse.json(
      { error: 'Failed to auto-delete tasks' },
      { status: 500 }
    );
  }
}
