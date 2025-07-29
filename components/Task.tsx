'use client'
import React, {useState} from 'react'
import { Edit, Trash, ArrowBigUpIcon, ArrowBigDown  } from 'lucide-react'
import TaskModal from './TaskModal'
import { TaskData } from './TaskModal'
import { toast } from 'sonner'
import DeadlineCountdown from './DynamicCountdown'

function Task({EachTask, onTaskChange}: {EachTask: TaskData, onTaskChange: ()=> void}) {
    const [task, setTask] = useState<TaskData>( EachTask || {
    id:'',
    name: '',
    description: '',
    deadline: '',
    sendNotification: false,
    })
    const [selected, setSelected] = useState<"Completed" | "Due">(EachTask.status ?? "Due")
    const [open, setOpen] = useState(false)
    const [action, setAction] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editMode, setEditMode] = useState(false)


    const onSubmit = async(updatedTask: TaskData) => {
        console.log('Task updated:', updatedTask)
        setTask(updatedTask)
        try {

            const res= await fetch(`api/task/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            })
            if (!res.ok) {
                throw new Error('Failed to update task')
            }
                  toast.success('Task submitted successfully!') // or alert('Success')
                  setIsModalOpen(false)
            
        } catch (error) {
            const err = error as Error
                  toast.error(`Error submitting task: ${err.message}`) // or alert(err.message)
                  console.error(err)
        }

    }

    const handleStatusChange = async (newStatus:"Completed" | "Due") => {
        setSelected(newStatus);
        console.log(newStatus)
        setTask(prev => ({ ...prev, status: newStatus }));
        try {
            const res = await fetch(`/api/task/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...task, status: newStatus }),
            });
            console.log(res)
            if (!res.ok) throw new Error('Failed to update status');
            onTaskChange();
            toast.success('Status updated!');
        } catch (error) {
            toast.error('Error updating status');
            console.error(error);
        }
    };


    const handleDelete = async () => {
        try {
            const res = await fetch(`/api/task/${task.id}`, {
                method: 'DELETE',
            })

            if (!res.ok) {
                throw new Error('Failed to delete task')
            }

            toast.success('Task deleted successfully!')
            setAction(false)
            onTaskChange()
        } catch (error) {
            const err = error as Error  
            toast.error(`Error deleting task: ${err.message}`)
            console.error(err)
        }
    }

  return (
    <div className='relative'>
            <div className={'relative flex flex-col md:flex-row gap-2 text-cyan-900 mx-[4%] my-[4%] md:mx-[4%] md:my-[4px] items-center justify-around md:justify-between  rounded-md px-10  bg-white shadow-md shadow-cyan-900 p-5 ' + (open ? 'min-h-[350px] md:min-h-[200px]' : 'min-h-[250px] md:min-h-[20px]')}>
                <div className='md:w-[60%]'>{task.name}</div>
                {
                    open && (
                        <div className='md:w-[50%]'>
                            {task.description || 'No description provided'}
                        </div>
                    )
                }
                <div>
                    <DeadlineCountdown deadline={task.deadline} />
                </div>

                <div className="flex gap-2 bg-gray-200 p-1 rounded-full w-max">
                {(['Completed', 'Due'] as const).map((option) => (
                    <button
                    key={option}
                     onClick={() => handleStatusChange(option)}
                    className={`px-4 py-1 rounded-full transition-all duration-300 ${
                        selected === option
                        ? 'bg-cyan-900 text-gray-200 shadow'
                        : 'bg-gray-200 text-cyan-900'
                    }`}
                    >
                    {option}
                    </button>
                ))}
                </div>
                <div className=''>
                    <button 
                    onClick={() => setAction(!action)}
                    className=' absolute cursor-pointer top-3 right-3  font-bold text-3xl text-red-600 flex items-center justify-around gap-1 hover:scale-125'>
                        {
                            Array.from({length: 3}, (_, i) => (
                            <div key={i} className='h-1 w-1 bg-cyan-600 rounded-full hover:scale-200'></div>
                            ))
                        }
                    </button>
                    <div>
                        {action && (
                            <div className='absolute top-5 right-0  opacity-90 bg-cyan-900 text-white shadow-lg rounded-md '>
                                <ul className='flex'>
                                    <button
                                        onClick={() => {
                                            setEditMode(true)
                                            setIsModalOpen(true)
                                            setAction(false)
                                        }}
                                        className="cursor-pointer border-2 border-cyan-900 rounded-md hover:text-cyan-900 hover:bg-white p-4"
                                        >
                                        <Edit />
                                    </button>
                                    <button 
                                     onClick={() => {
                                        handleDelete()
                                        setAction(false)
                                     }}
                                    className='cursor-pointer border-2 border-cyan-900 rounded-md hover:text-cyan-900 hover:bg-white p-4'>
                                        <Trash/>
                                    </button>

                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div>
                <button
                    onClick={() => setOpen(!open)}
                    className='absolute cursor-pointer bottom-0 left-[50%] shadow-2xl shadow-cyan-900'
                >
                 {
                    open ? ( 
                        <ArrowBigUpIcon className='h-8 w-8 text-cyan-900 fill-cyan-800 hover:text-cyan-800 transition-all duration-300 hover:translate-y-[-10px] hover:scale-110 ' />)
                         :( <ArrowBigDown className='h-8 w-8 text-cyan-900 fill-cyan-800 hover:text-cyan-800 transition-all duration-300 hover:translate-y-[10px] hover:scale-110 ' />)
                 }
                </button>
            </div>
            {isModalOpen && (
            <TaskModal
                onClose={() => {
                setIsModalOpen(false)
                setEditMode(false)
                }}
                onSubmit={onSubmit}
                initialTask={editMode ? task : undefined}
            />
            )}
    </div>
  )
}

export default Task