import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@mui/material'
import axios from 'axios'
import GroupBtnCompo from '../components/groupsPage/GroupBtnCompo'
import Groups from '../components/groupsPage/Groups'
import GroupDetails from '../components/groupsPage/GroupDetails'


const { VITE_BACKEND_HOST } = import.meta.env

const GroupsPage = () => {
    const navigate = useNavigate()
    const access_token = localStorage.getItem('access_token')
    const [userProfile, setUserProfile] = useState()
    const [userTeams, setUserTeams] = useState([])
    const [team, setTeam] = useState()
    const [groupStatus, setGroupStatus] = useState(false)
    const userProfileLocalStorage = localStorage.getItem('userProfile')


    //userTeams [{teamID, ownerID}]

    const fetchTeams = () => {
        axios.get(
            `${VITE_BACKEND_HOST}/api/1.0/groups/getTeams`,
            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }
        ).then(response => {
            setUserTeams(response.data)
        })
    }

    useEffect(() => {
        if (!access_token) {
            console.log("no token")
            navigate('/Login')
        } else {

            fetchTeams()
            setUserProfile(JSON.parse(userProfileLocalStorage))
        }
    }, [])



    return (
        <div className=' background items-center flex'>
            {
                userProfile ? (
                
                    <Sidebar userProfile={userProfile} />
                  
                )
                    :
                    <Skeleton variant="rectangular" width={210} height={118} />
            }
            
            <div id='groupsContainer' className='h-[96%]  rounded-2xl w-[70%]'>
                {/* <GroupDetails team={team} access_token={access_token}/> */}

                {/* {
                    userTeams.map((team, idx) => (
                        <GroupBtnCompo key={idx} team={team} access_token={access_token}/>
                    ))
                } */}
                <div className={`${groupStatus ? 'hidden' : '' }`}>
                    <Groups userTeams={userTeams} access_token={access_token} setGroupStatus={setGroupStatus} setTeam={setTeam}/>
                </div>
                <div className={`${groupStatus ? '' : 'hidden' } h-full`}>
                    {
                        team ? <GroupDetails team={team} access_token={access_token} userProfile={userProfile}/> : <div></div>
                    }
                    
                </div>
                
            </div>
        </div>
    )
}

export default GroupsPage