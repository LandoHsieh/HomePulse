import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'

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
            
        </div>
    )
}

export default LogsPage