import { Button } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import SendIcon from '@mui/icons-material/Send';
const { VITE_BACKEND_HOST } = import.meta.env

const GroupBtnCompo = ({ team, access_token, setGroupStatus, setTeam }) => {
  //team: teamID, ownerID
  //teamInfo: teamID, teamName, ownerID, member, devices
  const [teamInfo, setTeamInfo] = useState({})
  const [ownerName, setOwnerName] = useState('')
  const fetchTeamInfo = () => {
    axios.get(
      `${VITE_BACKEND_HOST}/api/1.0/groups/getTeamInfo?teamID=${team.teamID}`,
      {
        headers: {
          Authorization: `bearer ${access_token}`
        }
      }
    ).then(response => {
      console.log(response.data)
      setTeamInfo(response.data)
      fetchOwnerName(response.data.ownerID)
    })
  }
  const fetchOwnerName = (ownerID) => {
    axios.get(
      `${VITE_BACKEND_HOST}/api/1.0/groups/getOwnerName?ownerID=${ownerID}`,
      {
        headers: {
          Authorization: `bearer ${access_token}`
        }
      }
    ).then(response => {
      setOwnerName(response.data)
    })
  }

  const handleBtnClick = () => {
    setTeam(team)
    setGroupStatus(true)
  }

  useEffect(() => {
    fetchTeamInfo()
  }, [])

  if(Object.keys(teamInfo).length === 0) return

  return (
    <div className=' flex justify-around  bg-gray-300 rounded-2xl border-2 m-5'>
      <div id='teamName' className='flex flex-col items-center'>
        <div className='text-lg'>
          Name
        </div>
        <div>
          {teamInfo.teamName}
        </div>
      </div>

      <div id='teamOwner' className='flex flex-col items-center'>
        <div className='text-lg'>
          Owner
        </div>
        <div>
          {ownerName}
        </div>
      </div>

      <div id='memberCount' className='flex flex-col items-center'>
        <div className='text-lg'>
          Users
        </div>
        <div>
          {teamInfo.member.length}
        </div>
      </div>

      <Button variant="text" endIcon={<SendIcon />} onClick={handleBtnClick}>
        Enter
      </Button>
    </div>
  )
}

export default GroupBtnCompo