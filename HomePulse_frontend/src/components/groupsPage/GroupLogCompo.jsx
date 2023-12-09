import { Login } from '@mui/icons-material'
import React from 'react'

const GroupLogCompo = ({logInfo}) => {
    //logInfo: userID, userName, teamID, event, createAt
  return (
    <div className='flex bg-gray-300 justify-around rounded-xl h-10 items-center'>
        <div>{logInfo.userName}</div>
        <div>{logInfo.event}</div>
        <div>{logInfo.createAt}</div>
    </div>
  )
}

export default GroupLogCompo