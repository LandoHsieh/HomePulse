import axios from 'axios'
import React, { useEffect, useState } from 'react'
import GroupDeviceCompo from './GroupDeviceCompo'
import { useSocket } from '../monitorPage/SocketComponent'


const { VITE_BACKEND_HOST } = import.meta.env

const GroupControllers = ({ team, access_token, userProfile }) => {
  //team: teamID, ownerID
  const [controllers, setControllers] = useState([])
  const socket = useSocket()
  const fetchControllers = () => {

    axios.post(
      `${VITE_BACKEND_HOST}/api/1.0/groups/getOwner/spec_devices`,
      {
        ownerID: team.ownerID,
        method: 'control'
      },
      {
        headers: {
          Authorization: `bearer ${access_token}`
        }
      }
    ).then(response => setControllers(response.data))
  }

  useEffect(() => {
    if(socket){
      fetchControllers()

      return () => {

        socket.disconnect()
      }
    }
    

  }, [team, socket])


  return (
    <div>
      <div className='flex gap-3'>
        {
          controllers?.map((controller, idx) => (
            <GroupDeviceCompo key={idx} deviceInfo={controller} access_token={access_token} userProfile={userProfile} socket={socket} team={team}/>
          ))
        }
      </div>

    </div>
  )
}

export default GroupControllers