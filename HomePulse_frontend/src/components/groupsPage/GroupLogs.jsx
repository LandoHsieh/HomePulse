import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSocket } from '../monitorPage/SocketComponent'
import GroupLogCompo from './GroupLogCompo'
import { DataGrid } from '@mui/x-data-grid'

const { VITE_BACKEND_HOST } = import.meta.env

const GroupLogs = ({ team, access_token }) => {
  const [logsHistory, setLogsHistory] = useState([])
  const socket = useSocket()
  const teamID = team.teamID
  const currentDateTime = new Date()
  useEffect(() => {

    if (socket) {
      fetchLogsHistory()
      socket.emit('joinLogsRoom', { teamID })
      socket.on('logMessage', (logMessage) => {
        setLogsHistory(prevLogs => [...prevLogs, logMessage])
        console.log('log message: ', logMessage)
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
  const formatDate = (date) => {
    let targetDate = new Date(date)
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true, // 使用12小時制
    };
    const formattedDate = targetDate.toLocaleString('zh-TW', options)
    return formattedDate
}

const timeGapCal = (givenDateTimeString) => {
    const givenDateTime = new Date(givenDateTimeString)
    const timeDiff = Math.abs(currentDateTime - givenDateTime)
    const minutes = Math.floor(timeDiff / (1000 * 60))
    const hours = Math.floor(timeDiff / (1000 * 60 * 60))
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24))
    const months = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30.44));
    if( days > 30 ){
        return `${months} months ago`
    }else if( hours > 24){
        return `${days} days ago`
    }else if( minutes > 60){
        return `${hours} hours ago`
    }else {
        return `${minutes} minutes ago`
    }
}

  return (
    <div className='flex flex-col gap-10 h-[600px]'>
      <DataGrid 
        className=''
        initialState={{
          sorting: {
            sortModel: [{ field: 'time', sort: 'desc' }]
          }
        }}
        columns={[
          { field: 'userName', disableColumnMenu: true, sortable: false, headerName: 'User Name', headerAlign: 'center', align: 'center', width: 180 },
          { field: 'event', disableColumnMenu: true, sortable: false, headerName: 'Event', headerAlign: 'center', align: 'center', width: 250 },
          { field: 'time', disableColumnMenu: true, sortable: true, headerName: 'Time', headerAlign: 'center', align: 'center', width: 250 },
          { field: 'gap', disableColumnMenu: true, sortable: false, headerName: 'Time Gap', headerAlign: 'center', align: 'center', width: 250 }
        ]}
        rows={
          logsHistory.map((log, idx) => ({
            id: idx,
            userName: log.userName,
            event: log.event,
            time: formatDate(log.createAt),
            gap: timeGapCal(log.createAt)
          }))
        }
      />
      {/* {
        logsHistory.map((log, idx) => (
          <GroupLogCompo key={idx} logInfo={log}/>
        ))
      } */}
      {/* {
        JSON.stringify(logsHistory)
      } */}
    </div>
  )
}


export default GroupLogs