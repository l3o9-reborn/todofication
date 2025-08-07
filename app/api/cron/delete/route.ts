import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export const config = {
  runtime: 'edge',          // Edge runtime required for Vercel cron jobs
};

export async function GET(request: Request) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('[CRON] /api/cron/delete executed at:', new Date().toISOString());

  try {
    const nowUtc = dayjs().utc();
    let totalDeleted = 0;

    const settings = await prisma.settings.findMany({
      where: { ae: true },
    });

    const debugInfo = [];

    for (const s of settings) {


      const deleted = await prisma.task.deleteMany({
        where: {
          userId: s.userId,
          deadline: { lt: nowUtc.toDate() }, // compare using UTC
        },
      });

      debugInfo.push({
        userId: s.userId,
        deletedCount: deleted.count,
      });

      totalDeleted += deleted.count;
    }

    return new Response(
      JSON.stringify({ status: 'Success', totalDeleted, debugInfo }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Cron delete error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
