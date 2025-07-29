'use client'
import SideBar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import Task from "@/components/Task";
import { useState, useEffect, useCallback } from "react";
import { TaskData } from "@/components/TaskModal";


export default function Home() {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [selected, setSelected] = useState<'ALL' | 'COMPLETED' | 'DUE' >('ALL')
  const [search, setSearch]=useState<string>('')
  
  const fetchTasks = useCallback(async () => {
    try {
      const response = await fetch('/api/task');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, []);
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
const filteredTasks = tasks.filter(task => {
  // Filter by status
  const statusMatch =
    selected === 'ALL'
      ? true
      : selected === 'COMPLETED'
        ? task.status === 'Completed'
        : task.status === 'Due';

  // Filter by search (case-insensitive, checks name and description)
  const searchMatch =
    task.name.toLowerCase().includes(search.toLowerCase()) ||
    (task.description?.toLowerCase().includes(search.toLowerCase()) ?? false);

  return statusMatch && searchMatch;
});
  return (
    <div className=" h-screen w-full bg-gray-100 z-10">
      <SearchBar selected={selected} setSelected={setSelected} search={search} setSearch={setSearch}/>
  
      <SideBar onTaskChange={fetchTasks}/>
      {
        filteredTasks.map((task) => (
          <Task key={task.id} EachTask={task} onTaskChange={fetchTasks}/>
        ))
      }
    </div>
  );
}
