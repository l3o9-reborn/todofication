'use client'
import React, { useState } from 'react'

export default function StatusDropdown({selected, setSelected}:
  {selected: 'ALL' | 'COMPLETED' | 'DUE', setSelected:React.Dispatch<React.SetStateAction<'ALL' | 'COMPLETED' | 'DUE'>>}) {
  
  const [open, setOpen] = useState(false)

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex cursor-pointer justify-between items-center w-40 px-4 py-2 border-2 border-cyan-900 bg-cyan-900 rounded-md shadow-sm "
      >
        {selected || 'Sort By'}
        <svg
          className="w-4 h-4 ml-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M5.5 7l4.5 4.5L14.5 7" />
        </svg>
      </button>

      {open && (
        <div className="absolute mt-2 w-40 bg-cyan-900 border cursor-pointer  rounded-md shadow-lg z-10">
          <form className="p-2">
            {['ALL','COMPLETED', 'DUE'].map((status) => (
              <label key={status} className="flex items-center p-1 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={selected === status}
                  onChange={() => {
                    setSelected(status as 'ALL' | 'COMPLETED' | 'DUE')
                    setOpen(false)
                  }}
                  className="mr-2 cursor-pointer"
                />
                {status}
              </label>
            ))}
          </form>
        </div>
      )}
    </div>
  )
}
