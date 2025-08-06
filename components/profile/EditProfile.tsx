import React, { SetStateAction, useState } from 'react'
import { ProfileInterface } from './ProfileSection'

interface Props {
  profile: ProfileInterface;
  setProfile: React.Dispatch<SetStateAction<ProfileInterface>>;
  setOpenEditModal: (open: boolean) => void;
  setUpdateChanges: (open:boolean) =>void
}

function EditProfile({profile, setProfile, setOpenEditModal,setUpdateChanges}:Props) {
  const handleInputChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
    const {name, value}= e.target
      setProfile((prev)=>({
        ...prev,
        [name]:value
      }))
  }
  const [previous]=useState<{name:string, bio:string}>({
    name:profile.name,
    bio:profile.bio,
  })
  
   const handleSave =() =>{
     setUpdateChanges(true)
     setOpenEditModal(false) 
   }

   const close =()=>{
    setProfile((prev)=>({
        ...prev,
        name: previous.name,
        bio:previous.bio
    }))
    setOpenEditModal(false) 
   }


  return (
   <div className="fixed inset-0 flex items-center justify-center z-39 bg-black/30 backdrop-blur-sm">
        <div className="relative bg-white p-5 rounded-md shadow-md shadow-cyan-900 w-[90%] md:w-[50%] max-w-[500px] text-cyan-900">
                    <button onClick={close}>
                        <span className="absolute top-3 right-3 font-bold text-xl cursor-pointer">×</span>
                    </button>
            <div className="w-full mb-4">
                <label className="block mb-1">Name</label>
                <input
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleInputChange}
                    className="w-full h-10 border-2 border-cyan-900 rounded-md outline-none focus:border-cyan-800 p-2"
                    placeholder="Enter Task"
                />
            </div>
            <div className="w-full mb-4">
                <label className="block mb-1">Bio</label>
                <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleInputChange}
                    className="w-full h-30 border-2 border-cyan-900 rounded-md outline-none focus:border-cyan-800 p-2"
                    placeholder="Enter Task"
                />
            </div>
            <button
            onClick={handleSave}
            className="w-full py-2 cursor-pointer px-4 bg-cyan-900 text-white rounded-md hover:bg-cyan-800 transition-colors duration-300"
            >
                Save Changes
            </button>
        </div>
    </div>
  )
}

export default EditProfile