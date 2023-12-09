import { Button } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2'
import AddMonitorCompo from './AddMonitorCompo'
import MonitorCompo from './MonitorCompo'
import { SocketProvider } from './SocketComponent'

const { VITE_BACKEND_HOST } = import.meta.env

const Monitors = ({ access_token, userID }) => {

    const navigate = useNavigate()
    const [showAddMonitor, setShowAddMonitor] = useState(false)
    const [showDelete, setShowDelete] = useState(false)

    const handleDeleteMonitor = (deviceID, deviceName) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(
                    `${VITE_BACKEND_HOST}/api/1.0/devices/remove_device`,
                    {
                        data: {
                            deviceID: deviceID
                        },
                        headers: {
                            Authorization: `bearer ${access_token}`
                        }
                    }
                ).then(response => {
                    if (response.status === 200) {
                        Swal.fire({
                            title: "Deleted!",
                            text: `${deviceName} has been deleted.`,
                            icon: "success"
                        })
                        refetch()
                    }
                })
            }
        })
    }

    const { data, isLoading, isError, error, refetch } = useQuery({
        queryKey: ["monitors"],
        queryFn: () => axios.get(
            `${VITE_BACKEND_HOST}/api/1.0/user/get/spec_devices/monitor`,
            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }),
        refetchOnWindowFocus: true,
        refetchOnMount: true
    })
    if (isLoading) return <div>Loading...</div>;
    if (isError) navigate('/Login')
    if (!data) return

    //console.log("monitors: ", data.data)

    if (data.data.length === 0) {
        return (

            <div id='container' className='flex flex-col gap-5 h-full justify-center m-5 border-2  rounded-3xl items-center'>
                <div>There are currently no monitors.</div>
                <Button
                    variant="contained"
                    onClick={() => setShowAddMonitor(true)}
                    startIcon={<AddIcon />}
                >
                    Add monitor
                </Button>
                <AddMonitorCompo show={showAddMonitor} onClose={() => setShowAddMonitor(false)} access_token={access_token} refetch={refetch} />

            </div>
        )
    }
    // console.log("monitors: ", data.data)
    // console.log('user: ', userID)
    const monitors = data.data
    const monitor = data.data[0]
    //console.log("deviceID: ", monitor.deviceID)
    return (
        <SocketProvider>

        <div className="flex flex-col gap-3 h-full ">
            <div id="titleAndDelete" className="flex justify-start gap-5">
                <div className="text-xl ">Monitors</div>
                <AddIcon onClick={() => setShowAddMonitor(true)} className=" cursor-pointer" />
                <DeleteIcon onClick={() => setShowDelete(!showDelete)} className=" cursor-pointer" />
            </div>
            <div id="devicesContainer" className='flex  gap-5 rounded-2xl bg-[#DCE1F5] p-5 items-center'>
                {
                    monitors.map((monitor, idx) => (
                        <div id="device" key={idx} className="flex flex-col gap-3">
                            <MonitorCompo userID={userID} device={monitor}  />
                            <div className={`${showDelete ? 'flex' : 'hidden'}`}>
                                <Button
                                    className="w-full"
                                    variant="contained"
                                    color="error"
                                    endIcon={<DeleteIcon />}
                                    onClick={() => { handleDeleteMonitor(monitor.deviceID, monitor.deviceName) }}
                                >
                                    Remove
                                </Button>
                            </div>

                        </div>
                    ))
                }   
            </div>
            <AddMonitorCompo show={showAddMonitor} onClose={() => setShowAddMonitor(false)} access_token={access_token} refetch={refetch} />
        </div>
        </SocketProvider>
    )
}

export default Monitors