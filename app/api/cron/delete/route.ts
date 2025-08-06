import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET() {
  try {
    const nowUtc = dayjs().utc();

    // Fetch users with auto-clean enabled
    const settings = await prisma.settings.findMany({
      where: {
        ae: true,
      },
    });

    let totalDeleted = 0;

    // Iterate over each user's settings
    for (const s of settings) {
      const tz = s.timezone || 'UTC';

      // Current time in user's timezone
      const nowLocal = nowUtc.tz(tz).format('HH:mm');

      // Only proceed if current time matches user's preferred delete time
      if (nowLocal === s.at) {
        const deleted = await prisma.task.deleteMany({
          where: {
            userId: s.userId,
            deadline: { lt: new Date() }, // past deadline
          },
        });
        totalDeleted += deleted.count;
      }
    }

    return NextResponse.json({ message: 'Old tasks deleted', count: totalDeleted });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete tasks' }, { status: 500 });
  }
}
