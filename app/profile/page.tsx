'use client'
import SideBar from '@/components/SideBar'
import ProfileSection from '@/components/profile/ProfileSection'
import ReportsSection from '@/components/profile/ReportsSection'

export default function ProfilePage() {

  return (
   <div className=''>
     <ProfileSection/>
     <ReportsSection/>
    <SideBar onTaskChange={()=>(console.log('task Changed'))}/>
   </div>
  )
}
