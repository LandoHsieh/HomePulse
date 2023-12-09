import React, { useState } from 'react'
import LightIcon from '@mui/icons-material/Light';
import { IconButton, Switch } from '@mui/material';
import axios from 'axios';
import { Fingerprint } from '@mui/icons-material';
import DeviceIcon from './deviceIcon';

const { VITE_BACKEND_HOST } = import.meta.env

const DeviceCompo = ({ deviceInfo, access_token }) => {

    const [status, setStatus] = useState(false) //fixme 每次預設開關都是關，要改為偵測開關目前狀態去做顯示（checkDeviceStatus API）
    
    const type = deviceInfo.type
    const switchType = deviceInfo.switch
    
    const handleSwitchChange = (event) => {
        setStatus(event.target.checked)
        axios.post(
            `${VITE_BACKEND_HOST}/api/1.0/devices/control/${type}`,
            {
                deviceID: deviceInfo.deviceID,
                status: `${event.target.checked ? 'on' : 'off'}`
            },
            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }
        )
    }

    const handleButtonClick = () => {
        axios.post(
            `${VITE_BACKEND_HOST}/api/1.0/devices/control/${type}`,
            {
                deviceID: deviceInfo.deviceID
            },
            {
                headers: {
                    Authorization: `bearer ${access_token}`
                }
            }
        )
    }

    return (
        <div id="device" className={`flex justify-between w-[163px] h-[136px] ${status ? ' bg-violet-400' : 'bg-white'} rounded-[25px] shadow-inner border border-slate-200 border-opacity-80 p-[14px]`}>
            <div id='left' className='flex flex-col justify-between'>
                <div>{status ? 'ON' : 'OFF'}</div>
                {/* <LightIcon /> */}
                <DeviceIcon iconID={deviceInfo.iconID}/>
                <div className={`${status ? 'text-white' : 'text-violet-500'}`} >{deviceInfo.deviceName}</div>
            </div>
            <div id="right">
                {
                    switchType === 'bidirectional' ?
                        <Switch onChange={handleSwitchChange} color='secondary'/> :
                        <IconButton aria-label="fingerprint" color="secondary" onClick={handleButtonClick}><Fingerprint /></IconButton>
                }

            </div>
        </div>
    )
}

export default DeviceCompo