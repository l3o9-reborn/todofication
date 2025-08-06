// app/api/report/summary/route.ts
import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

export async function GET() {
  const now = new Date()

  // Define the start and end of the current month
  const firstDayOfMonth = startOfMonth(now)
  const lastDayOfMonth = endOfMonth(now)

  // Generate an array of all days in the current month
  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  })

  // Initialize an array to store daily report data
  const dailyReport = []

  // Utility function to get count for a given Prisma where clause
  const getCount = (where: Prisma.TaskWhereInput) => prisma.task.count({ where })

  // Loop through each day of the month to gather data
  for (const day of daysInMonth) {
    const dayStart = startOfDay(day)
    const dayEnd = endOfDay(day)

    // Define the date range for the current day (tasks created within this day)
    const dateFilter = {
      gte: dayStart,
      lt: dayEnd,
    }

    // Get counts for tasks registered (created) on this day
    const registeredOnDay = await getCount({
      createdAt: dateFilter,
    })

    // Get counts for tasks completed on this day (created on this day and status is 'Completed')
    const completedOnDay = await getCount({
      status: 'Completed',
      createdAt: dateFilter,
    })

    // Get counts for tasks due on this day (created on this day and status is 'Due')
    const dueOnDay = await getCount({
      status: 'Due',
      createdAt: dateFilter,
    })

    dailyReport.push({
      date: day.toISOString().split('T')[0], // Format date as YYYY-MM-DD for easier graphing
      registered: registeredOnDay,
      completed: completedOnDay,
      due: dueOnDay, // Added 'due' count
    })
  }

  // Return the aggregated daily report
  return NextResponse.json({
    dailyReport,
  })
}