'use client'

import { useSearchParams } from 'next/navigation'

export default function StatusBanner() {
  const params  = useSearchParams()
  const status  = params.get('status')

  if (status === 'success')
    return (
      <p className="text-green-400 text-center">
        ✅ Magic link sent! Check your inbox.
      </p>
    )

  if (status === 'error')
    return (
      <p className="text-red-400 text-center">
        ❌ Something went wrong. Please try again.
      </p>
    )

  return null
}
