import { useEffect, useState } from "react"
import { Camera, Edit } from "lucide-react"
import EditProfile from "./EditProfile"
export interface ProfileInterface{
  profileImage: string
  coverImage:string
  name:string
  email: string
  bio: string
}

export default function ProfileSection() {

const [profile, setProfile] = useState<ProfileInterface>({
  profileImage: ' ',
  coverImage: ' ',
  name: '',
  email: '',
  bio: ''
})


  const [showTooltip, setShowTooltip] = useState(false)
  const[openEditModal, setOpenEditModal]= useState(false)
  const [updateChanges, setUpdateChanges]= useState(false)

  const handleImageUpload = async (file:  File | undefined) => {

      if (!file) {
        console.error('No file provided');
        return;
      }
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'next_uploads') // your unsigned preset name

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      })

      console.log(response)

      const data = await response.json()
      console.log('Uploaded Image and the url is',data.secure_url)
      return data.secure_url
      
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  const name = e.target.name

  if (!file) return

  const uploadedUrl = await handleImageUpload(file)

  if (uploadedUrl) {
    setProfile(prev => ({
      ...prev,
      [name === 'profile' ? 'profileImage' : 'coverImage']: uploadedUrl
    }))
    setUpdateChanges(true)
  }
}


  const updateProfile= async()=>{
    try {
     
      const res= await fetch('/api/profile', {
        method:'PUT',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(profile)
      })
      if(!res.ok) throw new Error('Failed to update profile')
      
      const updatedData = await res.json()
      console.log('Profile updated successfully:', updatedData)
    } catch (err) {
      const error = err as Error
      console.error('Error updating profile:', error)
    } 
  }

  const fetchProfile = async()=>{
    try {

      const res= await fetch('api/profile')
      if(!res.ok) throw new Error('Failed to fetch profile')
      const {profileImage, coverImage, name, email, bio} = await res.json()
      setProfile({
        profileImage: profileImage,
        coverImage: coverImage,
        name: name,
        email:email,
        bio:bio
      })
    } catch (err) {
      const error = err as Error
      console.error('Error fetching profile:', error)
    }
  }


  useEffect(()=>{
    fetchProfile()
  },[])


  useEffect(()=>{
    if(updateChanges){
      updateProfile()
      setUpdateChanges(false)
    }
      

  },[updateChanges])
    

  return (
   <div className="text-cyan-900 relative max-w-[1200px] mx-auto">
        <div className="relative">
            <img src={profile.coverImage} alt=""
             className="w-full h-64 md:h-100 border-none rounded-b-xl  bg-amber-600 shadow-2xl shadow-cyan-950"
            />
            <label className="absolute bottom-[2%] right-[2%] z-33 bg-cyan-900 h-10 w-10 rounded-full flex items-center justify-center text-amber-600 hover:scale-105 cursor-pointer">
              <Camera />
              <input
                type="file"
                name="cover"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
        </div>
        <div className="absolute top-40 md:top-91 left-0 md:left-10  z-31 flex flex-col md:flex-row items-start md:items-center gap-3">
          <div className="relative">
            <img 
              className="h-36 w-36 rounded-full border-3 border-cyan-900 bg-gray-50 shadow-2xl shadow-amber-600" 
              src={profile.profileImage} alt="Profile"
            />
            <label className="absolute bottom-[2%] right-[2%] z-33 bg-cyan-900 h-10 w-10 rounded-full flex items-center justify-center text-amber-600 hover:scale-105 cursor-pointer">
              <Camera />
              <input
                type="file"
                name="profile"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

            <div className="ml-5 md:mt-5">
                <h1 className="text-2xl font-semibold text-cyan-800">{profile.name}</h1>
                <h4 className="text-sm text-amber-600 font-thin">{profile.email}</h4>
            </div>
        </div >
        <div className="mt-20 mx-5 py-10 self-start ">
            <h1 className="text-2xl font-bold my-4  ">Bio</h1>
            <p>
              {profile.bio}
            </p>
         
        </div>
        <div className="absolute top-69 md:top-105 right-5">
          <button
            onMouseEnter={()=>setShowTooltip(true)}
            onMouseLeave={()=>setShowTooltip(false)}
            onClick={()=>setOpenEditModal(true)}
            className="w-12 h-12 cursor-pointer border-2 text-gray-50 border-amber-600 rounded-full bg-red-600 flex items-center justify-center shadow-2xl shadow-amber-600 "
          >
            <Edit className="hover:scale-125 duration-300" />
          </button>
          {
            showTooltip && (
              <div className="text-cyan-900 absolute top-[30%] left-[-90px] rounded-md font-bold ">
                Edit Profile
              </div>
            )
          }
        </div>


          {
            openEditModal &&
              <EditProfile profile={profile} setProfile= {setProfile} setOpenEditModal={setOpenEditModal} setUpdateChanges={setUpdateChanges} />
          }
      
   </div>
  )
}
