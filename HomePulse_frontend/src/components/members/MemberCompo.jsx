import { Avatar } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const { VITE_BACKEND_HOST } = import.meta.env

const MemberCompo = ({ member, access_token }) => {
    //member: role, userID
    
    const [memberProfile, setMemberProfile] = useState({})
 
    useEffect(() => {
        axios.get(
            `${VITE_BACKEND_HOST}/api/1.0/groups/getMemberProfile?memberID=${member.userID}`,
            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }
        ).then(response => {
            setMemberProfile(response.data)
        })
    }, [])
    
    if(Object.keys(memberProfile).length === 0) return

    return (
        <div className=' flex flex-col gap-1 items-center'>
            <Avatar alt={memberProfile.userName} src={memberProfile.avatar} />
            <div>
                {memberProfile.userName}
            </div>
            <div className='text-gray-400 text-sm'>
                {member.role}
            </div>
        </div>
    )
}

export default MemberCompo