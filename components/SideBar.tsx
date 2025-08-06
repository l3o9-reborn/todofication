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
      icon: <Home  className=' h-6 w-6 text-amber-600'/>,
      href: '/'
    },
    {
      name: 'Add Task',
      icon: <Plus className='h-6 w-6 text-amber-600' />,
      onClick: () => setIsModalOpen(true)
    },
    {
      name: 'User',
      icon: <UserCog className='h-6 w-6 text-amber-600' />,
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
      <div className='fixed  bottom-5 md:bottom-10 left-[5%] md:left-[25%] h-[5%] md:w-[50%] xl:w-[30%] xl:left-[35%] w-[90%] shadow-2xl bg-cyan-900 border-b-10 border-amber-600 shadow-amber-600 rounded-full   z-99'>
        <div className='flex text-gray-50   justify-around items-center h-full w-full'>
          {Elements.map((element) =>
            element.href ? (
              <Link key={element.name} href={element.href}>
                <div className=' hover:scale-150 hover:text-white  transition-all duration-300 flex flex-col items-center justify-center'>
                  {element.icon}
                  <span className='  inline-block text-xs'>{element.name}</span>
                
                </div>
              </Link>
            ) : (
              <button
                key={element.name}
                onClick={element.onClick}
                className=' hover:text-white cursor-pointer  hover:scale-150 transition-all duration-300 flex flex-col items-center justify-center'
              >
                {element.icon}
                <span className='text-xs'>{element.name}</span>
              </button>
            )
          )}
        </div>
        {/* <div className='w-full h-1 rounded-2xl bg-amber-600'>

        </div> */}
      </div>

      {isModalOpen && (
        <TaskModal onClose={() => setIsModalOpen(false)} onSubmit={onSubmit} />
      )}
    </>
  )
}

export default SideBar
