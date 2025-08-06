'use client'
import React from 'react'
import StatusDropdown from './Button';

function SearchBar({selected, setSelected , search, setSearch}:
  {selected: 'ALL' | 'COMPLETED' | 'DUE', setSelected:React.Dispatch<React.SetStateAction<'ALL' | 'COMPLETED' | 'DUE'>>,
    search: string, setSearch:React.Dispatch<React.SetStateAction<string>>
  }) {
  return (
    <div>
          <div className=' h-20 py-10 mx-[5%] flex items-center justify-center'>
            <input
             value={search}
             onChange={(e) => setSearch(e.target.value)}
            className='text-cyan-900 w-full p-2 border-2 border-cyan-900 rounded-md outline-none focus:border-cyan-800'
            placeholder='Search Task'
            type="text " />
            {/* <button className='py-2  px-7 bg-cyan-900 border-2 border-cyan-900 rounded-r-md cursor-pointer '>
                <Search className='text-white hover:scale-125 transition-transform duration-300' />
            </button> */}
        </div>
        <div className='flex items-center justify-end mx-[5%] mb-5'>
         <StatusDropdown selected={selected} setSelected={setSelected} />
        </div>
    </div>
  )
}

export default SearchBar