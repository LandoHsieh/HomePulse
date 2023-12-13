import { Avatar, Skeleton } from '@mui/material'
import React from 'react'

const UserProfile = ({ toggle, userProfile }) => {
  return (
    <div className={` flex gap-5 items-center 
                    ${toggle ? "bg-none transition-all duration-300 delay-200" : " bg-slate-100 rounded-xl p-2"}`
    }>
      <div className='flex min-w-[3.5rem] h-[3.5rem] h-'>
        <Avatar
          alt={userProfile.userName}
          src={userProfile.avatar}
          sx={{ width: 56, height: 56 }}
        />
      </div>
      <div className={`${toggle ? " opacity-0 delay-100" : ""} overflow-hidden`}>
        <h3 className=" text-xl">{userProfile.userName}</h3>
        <span className=' text-[0.75rem] opacity-60'>{userProfile.email}</span>

      </div>
    </div>
  )
}

export default UserProfile