import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';

export const config = {
    runtime: 'edge',
};

interface DebugInfoEntry {
  user: string;
  tasksCount: number;
}

export async function GET(request:Request) {

   const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  console.log('[CRON] /api/cron/notify executed at:', new Date().toISOString());
  try {
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
        
      debugInfo.push({
        user: user.email,
        tasksCount: user.tasks.length,
      });

      const taskList = user.tasks.map(t => `- ${t.name}`).join('\n');
      const message = `Here are your due tasks:\n\n${taskList}`;

      await sendEmail({
        to: user.email,
        subject: 'Your Daily Task Summary',
        text: message,
      });
      
    }

   return new Response(
      JSON.stringify({ status: 'Notifications processed', debugInfo }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
       console.error(error);
    return new Response(
      JSON.stringify({ error: 'Failed to send notifications' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );

  }
}
