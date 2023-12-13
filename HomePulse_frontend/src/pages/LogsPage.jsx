import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import OwnerLogs from '../components/ownerLogsPage/OwnerLogs'
import { SocketProvider } from '../components/monitorPage/SocketComponent'

const LogsPage = () => {

    const navigate = useNavigate()
    const access_token = localStorage.getItem('access_token')
    const [userProfile, setUserProfile] = useState()
    const userProfileLocalStorage = localStorage.getItem('userProfile')

    useEffect(() => {
        if (!access_token) {
            console.log("no token")
            navigate('/Login')
        } else {
            setUserProfile(JSON.parse(userProfileLocalStorage))
        }
    }, [])



    return (

        <div className='background items-center'>
            {
                userProfile ? <Sidebar userProfile={userProfile} /> : <div></div>
            }
            {
                userProfile ?
                    <div id='groupsContainer' className='h-[96%]  w-[70%]'>
                        <SocketProvider>
                            <OwnerLogs teamID={userProfile.teamID} access_token={access_token} />
                        </SocketProvider>
                    </div> 
                    : 
                    <div id='groupsContainer' className='h-[96%] border rounded-2xl w-[70%]'></div>
            }

        </div>
    )
}

export default LogsPage