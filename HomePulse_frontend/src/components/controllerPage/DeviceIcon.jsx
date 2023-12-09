import React from 'react'
import SensorDoorOutlinedIcon from '@mui/icons-material/SensorDoorOutlined';
import LightIcon from '@mui/icons-material/Light';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import TvIcon from '@mui/icons-material/Tv';
import {deviceIcons} from './deviceIcons'

const DeviceIcon = ({iconID}) => {
    const icons = deviceIcons.reduce((acc, { iconID, icon }) => {
        acc[iconID] = icon
        return acc
    }, {})
    
  return (
    <div>
        { icons[iconID] }
    </div>
  )
}

export default DeviceIcon