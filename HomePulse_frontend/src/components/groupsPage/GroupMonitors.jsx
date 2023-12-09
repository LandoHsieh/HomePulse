import axios from 'axios'
import React, { useEffect, useState } from 'react'
import MonitorCompo from '../monitorPage/MonitorCompo'

const { VITE_BACKEND_HOST } = import.meta.env

const GroupMonitors = ({team, access_token}) => {
    //team : teamID, ownerID

    const [monitors, setMonitors] = useState([])

    const fetchMonitors = () => {
        axios.post(
            `${VITE_BACKEND_HOST}/api/1.0/groups/getOwner/spec_devices`,
            {
                ownerID: team.ownerID,
                method: 'monitor'
            },
            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }
        ).then(response => setMonitors(response.data))
    }

    useEffect(() => {
        fetchMonitors()
    }, [team])
  return (
    
    <div>
        {
            monitors.map((monitor, idx) => (
                <MonitorCompo key={idx} userID={team.ownerID} device={monitor} />
            ))
        }
    </div>
  )
}

export default GroupMonitors