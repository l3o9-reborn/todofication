'use client'
import React from 'react'
import { toast } from 'sonner'

  interface TaskModalProps {
    onClose: () => void
    onSubmit: (task: TaskData) => void
    initialTask?: TaskData
  }

  export interface TaskData {
    id?:string
    name: string
    description?: string
    deadline: string,
    status?: 'Completed' |'Due'
    sendNotification?: boolean
  }

  function TaskModal({ onClose, onSubmit, initialTask }: TaskModalProps) {
    const [task, setTask] = React.useState<TaskData>(
      initialTask || {
        id: '',
        name: '',
        description: '',
        deadline: '',
        sendNotification: false,
      }
    )

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target
    const checked = type === 'checkbox' && 'checked' in e.target ? (e.target as HTMLInputElement).checked : undefined

    setTask((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }


  const handleSubmit = () => {
    if (!task.name || !task.deadline) {
    toast.error('Task name and deadline are required.')
    return
    }

    //convert local deadline to UTC

    const utcDate = new Date(task.deadline).toISOString()
  

    const taskWithUTC:TaskData ={
      ...task,
      deadline: utcDate,
    }
    onSubmit(taskWithUTC)
    onClose() // optionally close after submit
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-90 bg-black/30 backdrop-blur-sm">
      <div className="relative bg-white p-5 rounded-md shadow-md shadow-cyan-900 w-[90%] md:w-[50%] max-w-[500px] text-cyan-900">
        <button onClick={onClose}>
          <span className="absolute top-3 right-3 font-bold text-xl cursor-pointer">×</span>
        </button>

        <div className="w-full mb-4">
          <label className="block mb-1">Task</label>
          <input
            name="name"
            type="text"
            value={task.name}
            onChange={handleChange}
            className="w-full h-10 border-2 border-cyan-900 rounded-md outline-none focus:border-cyan-800 p-2"
            placeholder="Enter Task"
          />
        </div>

        <div className="w-full mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="w-full h-24 p-2 border-2 border-cyan-900 rounded-md outline-none focus:border-cyan-800"
            placeholder="Enter task description..."
          ></textarea>
        </div>

        <div className="w-full mb-4">
          <label className="block mb-1">Deadline</label>
          <input
            name="deadline"
            type="datetime-local"
            value={task.deadline ? task.deadline.slice(0, 16) : ''}
            onChange={handleChange}
            className="w-full border-2  border-cyan-900 rounded-md h-10 p-2"
          />
        </div>

        {/* <div className="flex items-center mb-4">
          <input
            type="checkbox"
            name="sendNotification"
            checked={task.sendNotification}
            onChange={handleChange}
            className="accent-cyan-900 cursor-pointer w-5 h-5"
          />
          <label className="pl-3">Send Notification</label>
        </div> */}

        <button
          onClick={handleSubmit}
          className="w-full py-2 cursor-pointer px-4 bg-cyan-900 text-white rounded-md hover:bg-cyan-800 transition-colors duration-300"
        >
          {initialTask? 'Update task': 'Add Task'}
        </button>
      </div>
    </div>
  )
}

export default TaskModal
