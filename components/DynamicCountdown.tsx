'use client'
import React, { useEffect, useState } from 'react'

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function calculateTimeLeft(deadline?: string): TimeLeft {
  if (!deadline) return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }

  const deadlineMs = new Date(deadline).getTime()
  const now = Date.now()
  const diff = deadlineMs - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  const totalSeconds = Math.floor(diff / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return { days, hours, minutes, seconds, expired: false }
}

function DeadlineCountdown({ deadline }: { deadline?: string }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(deadline))

  useEffect(() => {
    if (!deadline) return

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(deadline))
    }, 1000)

    return () => clearInterval(interval)
  }, [deadline])

  return (
    <div>
      {!deadline ? (
        <span className="text-sm text-gray-500">No deadline set</span>
      ) : timeLeft.expired ? (
        <span className="text-sm text-red-500">Deadline passed</span>
      ) : (
        <span className="text-sm text-green-600">
          {timeLeft.days > 0
            ? `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m left`
            : timeLeft.hours > 0
            ? `${timeLeft.hours}h ${timeLeft.minutes}m left`
            : `${timeLeft.minutes}m ${timeLeft.seconds}s left`}
        </span>
      )}
    </div>
  )
}

export default DeadlineCountdown
