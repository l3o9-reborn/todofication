'use client'
import React, { useState } from 'react'
import { Home, Plus, UserCog } from 'lucide-react'
import Link from 'next/link'
import TaskModal from './TaskModal'
import { toast } from 'sonner'
import { TaskData } from './TaskModal'

function SideBar({onTaskChange}:{onTaskChange: ()=> void}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const Elements = [
    {
      name: 'Home',
      icon: <Home className='h-6 w-6' />,
      href: '/'
    },
    {
      name: 'Add Task',
      icon: <Plus className='h-6 w-6' />,
      onClick: () => setIsModalOpen(true)
    },
    {
      name: 'User',
      icon: <UserCog className='h-6 w-6' />,
      href: '/profile'
    }
  ]

  const onSubmit = async (task:TaskData) => {
    try {
      const res = await fetch('/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      })

      if (!res.ok) {
        throw new Error('Failed to submit task')
      }

      toast.success('Task submitted successfully!') // or alert('Success')
      setIsModalOpen(false) // Close modal on success
      onTaskChange()

    } catch (error) {
      const err = error as Error
      toast.error(`Error submitting task: ${err.message}`) // or alert(err.message)
      console.error(err)
    }
  }

  return (
    <>
      <div className='fixed bottom-10 left-[5%] md:left-[25%] rounded-full h-15 md:w-[50%] w-[90%] bg-gray-50 shadow-lg shadow-cyan-900 z-99'>
        <div className='flex justify-around items-center h-full w-full'>
          {Elements.map((element) =>
            element.href ? (
              <Link key={element.name} href={element.href}>
                <div className='text-cyan-900 hover:text-cyan-800 hover:scale-120 transition-all duration-300 flex flex-col items-center justify-center'>
                  {element.icon}
                  <span className='text-xs'>{element.name}</span>
                </div>
              </Link>
            ) : (
              <button
                key={element.name}
                onClick={element.onClick}
                className='text-cyan-900 cursor-pointer hover:text-cyan-800 hover:scale-120 transition-all duration-300 flex flex-col items-center justify-center'
              >
                {element.icon}
                <span className='text-xs'>{element.name}</span>
              </button>
            )
          )}
        </div>
      </div>

      {isModalOpen && (
        <TaskModal onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} />
      )}
    </>
  )
}

export default SideBar
