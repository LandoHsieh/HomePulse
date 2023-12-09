import { useSelector } from "react-redux"
import DeviceCompo from "./DeviceCompo"
import { Button } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddDeviceCompo from "./AddDeviceCompo";
import { useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2'
const { VITE_BACKEND_HOST } = import.meta.env

const Devices = ({ devices, access_token, refetch }) => {

  const [showAddDevice, setShowAddDevice] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  

  const handleDeleteDevice = (deviceID, deviceName) => {
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



  if (devices.length === 0) {
    return (

      <div id='container' className='flex gap-5 flex-col justify-center m-5 border-2 w-[50%] rounded-3xl h-[30%] items-center'>
        <div>There are currently no devices.</div>
        <Button
          variant="contained"
          onClick={() => setShowAddDevice(true)}
          startIcon={<AddIcon />}
        >
          Add device
        </Button>

        <AddDeviceCompo show={showAddDevice} onClose={() => setShowAddDevice(false)} access_token={access_token} refetch={refetch}/>
      </div>
    )
  }



  return (
    <div className="flex flex-col gap-3   ">
      <div id="titleAndDelete" className="flex justify-between">
        <div className="text-xl ml-5">Devices</div>
        <AddIcon onClick={() => setShowAddDevice(true)} className=" cursor-pointer" />
        <DeleteIcon onClick={() => setShowDelete(!showDelete)} className=" cursor-pointer" />
      </div>

      <div id='deviceContainer' className='flex ml-5 gap-5  rounded-2xl bg-[#DCE1F5] p-5 h-[30%] items-center'>
        {
          devices.map((device, idx) => (
            <div key={idx} className="flex flex-col gap-3">
              <DeviceCompo deviceInfo={device} access_token={access_token} />
              <div className={`${showDelete ? 'flex' : 'hidden'}`}>
                <Button
                  className="w-full"
                  variant="contained"
                  color="error"
                  endIcon={<DeleteIcon />}
                  onClick={() => { handleDeleteDevice(device.deviceID, device.deviceName) }}
                >
                  Remove
                </Button>
              </div>

            </div>
          ))
        }
      </div>
      <AddDeviceCompo show={showAddDevice} onClose={() => setShowAddDevice(false)} access_token={access_token} refetch={refetch}/>
    </div>

  )
}

export default Devices