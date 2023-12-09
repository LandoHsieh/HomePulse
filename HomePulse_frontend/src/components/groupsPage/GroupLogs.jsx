import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSocket } from '../monitorPage/SocketComponent'
import GroupLogCompo from './GroupLogCompo'

const { VITE_BACKEND_HOST } = import.meta.env

const GroupLogs = ({ team, access_token }) => {
  const [logsHistory, setLogsHistory] = useState([])
  const socket = useSocket()
  const teamID = team.teamID

  useEffect(() => {
    
    if (socket) {
      fetchLogsHistory()
      socket.emit('joinLogsRoom', { teamID })
      socket.on('logMessage', (logMessage) => {
        setLogsHistory(prevLogs => [...prevLogs, logMessage])
        console.log('log message: ',logMessage)
      })
      return () => {
        socket.emit('leaveLogsRoom', { teamID })
        //socket.off('')
        socket.disconnect()
      }
    }
    
  }, [team, socket])

  const fetchLogsHistory = () => {
    axios.get(
      `${VITE_BACKEND_HOST}/api/1.0/groups/getTeamLogsHistory?teamID=${team.teamID}`,
      {
        headers: {
          Authorization: `bearer ${access_token}`
        }
      }
    ).then(response => {
      console.log(response.data)
      setLogsHistory(response.data)
    })
  }

  return (
    <div className='flex flex-col gap-10 h-[700px] overflow-y-auto'>
      {
        logsHistory.map((log, idx) => (
          <GroupLogCompo key={idx} logInfo={log}/>
        ))
      }
      {/* {
        JSON.stringify(logsHistory)
      } */}
    </div>
  )
}


export default GroupLogs