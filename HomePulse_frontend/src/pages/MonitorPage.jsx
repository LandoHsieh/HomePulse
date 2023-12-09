import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import tokenValidFunc from '../utils/tokenValidFunc'
import axios from 'axios'
import Sidebar from '../components/sidebar/Sidebar'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import Monitors from '../components/monitorPage/Monitors'
import { SocketProvider } from '../components/monitorPage/SocketComponent'
import Swal from 'sweetalert2'
import Members from '../components/members/Members'
import ShareLink from '../components/common/ShareLink'


const { VITE_BACKEND_HOST } = import.meta.env

const MonitorPage = () => {

    const state = useSelector((state) => state.user)
    // console.log("state = ", state)
    // const [userProfile, setUserProfile] = useState({})
    const navigate = useNavigate()
    const location = useLocation()

    const queryParams = new URLSearchParams(location.search)

    let access_token = queryParams.get('token')

    if (!access_token) {
        access_token = localStorage.getItem('access_token')
    } else {
        localStorage.setItem('access_token', access_token)
    }

    const group_token = localStorage.getItem('group_invite')

    useEffect(() => {
        if (!access_token) {
            console.log("no token")
            navigate('/Login')
        }
        // if(data){
        //     setUserProfile(data.data)
        // }else{
        //     return
        // }
    }, [navigate])

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["userProfile"],
        queryFn: () => axios.get(
            `${VITE_BACKEND_HOST}/api/1.0/user/get/profile`,
            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }),
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        
    })

    //ERROR 做呼叫失敗的Error handling
    if (isLoading) return <div className='background'>Loading...</div>;
    if (isError) navigate('/Login')


    if (!data) return
  
    localStorage.setItem("userProfile", JSON.stringify(data.data));

    if (group_token) {
        axios.post(
            `${VITE_BACKEND_HOST}/api/1.0/groups/validate/group_token`,
            {
                group_token: group_token
            },

            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }
        ).then(group_response => {
            // group_response: userID, userName, groupID, groupName
            if (group_response.data.userID === data.data.userID) {
                Swal.fire({
                    title: "Invitation failed!",
                    text: `You can't invite yourself to your own group.`,
                    icon: "error"
                })
            } else {
                Swal.fire({
                    title: `${group_response.data.userName} invite you to the group.`,
                    text: `Group name: ${group_response.data.groupName}`,
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonColor: "##7fffd4",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Accept",
                }).then((result) => {
                    //如果受邀者按下確認邀請
                    if (result.isConfirmed) {
                        //TODO call add to group API
                        axios.post(
                            `${VITE_BACKEND_HOST}/api/1.0/groups/invite/add2group`,
                            {
                                ownerID: group_response.data.userID,
                                teamID: group_response.data.groupID
                            },
                            {
                                headers: {
                                    Authorization: `bearer ${access_token}`
                                }
                            }
                        ).then(add2groupRes => {
                            Swal.fire({
                                title: "Joined successfully!",
                                text: ``,
                                icon: "success"
                            })
                        })
                        //error add2group失敗處理
                    }
                })
            }

        }).catch((error) => {
            if (error.response.status === 403) {
                Swal.fire({
                    title: "Link Expired!",
                    text: `The invitation link has expired!`,
                    icon: "error"
                })
            }
            //error 錯誤group token處理
        })

        //TODO if yes, call add to group API

        localStorage.removeItem('group_invite')
    }

    return (
        
            <div className='w-full h-screen bg-back object-cover flex items-center'>
                <Sidebar userProfile={data.data} />
                <div className='flex flex-col h-[96%] mt-2 gap-10 w-[743px]'>

                    <div id="teamName" className='flex gap-3 items-center'>
                        <div className='text-3xl'>
                            {data.data.teamName}
                        </div>
                        <ShareLink teamID={data.data.teamID} teamName={data.data.teamName} access_token={access_token} />
                    </div>

                    <Members ownerID={data.data.userID} teamID={data.data.teamID} access_token={access_token}/>

                    <div className=' flex flex-col h-[30%] justify-center '>
                        <Monitors access_token={access_token} userID={data.data.userID} />
                    </div>

                </div>

                


            </div>
      

    )
}

export default MonitorPage

/*
    userProfile: data.data => 
        {
            "userID": 1,
            "userName": "Lando",
            "email": "landoycx113@gmail.com",
            "role": "user",
            "avatar": "https://picsum.photos/id/237/200/300",
            "teams": [
                {
                    "teamID": 2300
                }
            ],
            "teamID": 1210,
            "teamName": "Lando's Home"
        }

    
    
*/