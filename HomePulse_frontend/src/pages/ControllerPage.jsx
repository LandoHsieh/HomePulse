import React, { useEffect, useState } from 'react'
import Sidebar from '../components/sidebar/Sidebar'
import { useSelector } from 'react-redux'
import Devices from '../components/controllerPage/Devices'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@mui/material'


const { VITE_BACKEND_HOST } = import.meta.env


const ControllerPage = () => {
    const navigate = useNavigate()
    const access_token = localStorage.getItem('access_token')
    const [userProfile, setUserProfile] = useState()
    const userProfileLocalStorage = localStorage.getItem('userProfile')
    //console.log(userProfileLocalStorage)

    useEffect(() => {
        if (!access_token) {
            console.log("no token")
            navigate('/Login')
        } else {
            setUserProfile(JSON.parse(userProfileLocalStorage))
        }
    }, [])

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["userDevices"],
        queryFn: () => axios.get(
            `${VITE_BACKEND_HOST}/api/1.0/user/get/spec_devices/control`,
            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }),
        refetchOnWindowFocus: true,
        refetchOnMount: true
    })

    //ERROR 做呼叫失敗的Error handling
    if (isLoading) return <div>Loading...</div>;
    if (isError) navigate('/Login')

    if (!data) return
    console.log(data.data)
    return (
        <div className='background items-center'>
            {
                userProfile ? (
                    <>
                        <Sidebar userProfile={userProfile} />
                        <Devices devices={data.data} access_token={access_token} refetch={refetch}/>
                    </>

                )
                    :
                    <Skeleton variant="rectangular" width={210} height={118} />
            }


        </div>
    )
}

export default ControllerPage