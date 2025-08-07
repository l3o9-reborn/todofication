'use client'
import React, { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Settings } from 'lucide-react'
import SettingsBar from './SettingsBar'

function TopNav() {
  const pathname = usePathname()
  const [tooltip, setTooltip] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showSettings) return

    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSettings])

  return (
    <div
    ref={settingsRef}
    className='fixed max-w-[1400px] z-44 min-w-screen h-16 bg-gray-100 text-cyan-900 flex items-center justify-between 2xl:justify-center 2xl:gap-220 shadow-2xl shadow-amber-600 px-2 md:px-10'>
      <div>
        <h1 className='font-bold md:text-2xl'>TODOFICATION</h1>
      </div>
      {pathname === '/profile' && (
        <button
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          onClick={() => setShowSettings(prev => !prev)}
          className='cursor-pointer relative'
        >
          <Settings className='text-amber-600 fill-cyan-900 hover:scale-125 hover:rotate-180 duration-500' />
          {tooltip && (
            <span className='absolute bottom-[-20px] left-[-20px]'>Settings</span>
          )}
        </button>
      )}
      {showSettings && (
        <div
          
          className='fixed top-16 left-0 md:left-auto md:right-0 z-42'
        >
          <SettingsBar  setShowSettings={ setShowSettings}/>
        </div>
      )}
    </div>
  )
}

export default TopNav