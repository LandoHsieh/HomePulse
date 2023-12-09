import React, { useEffect, useState } from 'react'
import { Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2'
import { deviceIcons } from '../controllerPage/deviceIcons'

const { VITE_BACKEND_HOST } = import.meta.env
const AddMonitorCompo = ({ show, onClose, access_token, refetch }) => {

    const method = 'monitor'
    const switchType = 'none'
    const [deviceID, setDeviceID] = useState('')
    const [deviceName, setDeviceName] = useState('')
    const [type, setType] = useState('')
    const [icon, setIcon] = useState('')
    const [deviceIDError, setDeviceIDError] = useState(false)
    const [deviceNameError, setDeviceNameError] = useState(false)
    const [typeError, setTypeError] = useState(false)
    const [iconError, setIconError] = useState(false)

    useEffect(() => {
        setDeviceID('')
        setDeviceName('')
        setType('')
        setIcon('')
    }, [show])

    const handleSubmit = (e) => {
        e.preventDefault()
        setDeviceIDError(false)
        setDeviceNameError(false)
        setTypeError(false)
        setIconError(false)
        if (!deviceID) {
            setDeviceIDError(true)
        }

        if (!deviceName) {
            setDeviceNameError(true)
        }
        if (!type) {
            setTypeError(true)
        }
        if (!icon) {
            setIconError(true)
        }
        if (deviceID && deviceName && type && icon) {
            axios.post(
                `${VITE_BACKEND_HOST}/api/1.0/devices/add_device`,
                {
                    deviceID: deviceID,
                    deviceName: deviceName,
                    type: type,
                    method: method,
                    iconID: icon,
                    switchType: switchType
                },
                {
                    headers: {
                        Authorization: `bearer ${access_token}`
                    }
                }).then(response => {
                    if (response.status === 200) {
                        Swal.fire({
                            position: "center",
                            icon: "success",
                            title: `${deviceName} \n Create successfully!`,
                            showConfirmButton: false,
                            timer: 2500
                        });
                        refetch()
                    }
                }).catch(error => {
                    console.log(error.response)
                    if (error.response.status === 409) {
                        Swal.fire({
                            icon: "error",
                            title: "Creation failed",
                            text: `${error.response.data}`,
                        });
                    }

                })
        }
    }

    return (
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center ${show ? 'scale-100' : 'scale-0'} transition-transform duration-300`}>
            <div className="flex flex-col gap-7 bg-white p-5 rounded-lg shadow-lg transform transition-all w-[30%]">
                <form onSubmit={handleSubmit} noValidate autoComplete='off' className='flex flex-col gap-3'>
                    <TextField
                        id="deviceID"
                        value={deviceID}
                        required
                        onChange={(e) => setDeviceID(e.target.value)}
                        label="Device ID"
                        error={deviceIDError}
                    />

                    <TextField
                        id="deviceName"
                        value={deviceName}
                        required
                        onChange={(e) => setDeviceName(e.target.value)}
                        label="Device Name"
                        error={deviceNameError}
                    />

                    <FormControl required sx={{ minWidth: 120 }}>
                        <InputLabel>Type</InputLabel>
                        <Select
                            value={type}
                            label="Type *"
                            onChange={(e) => { setType(e.target.value) }}
                            error={typeError}
                        >
                            <MenuItem value={'temperature'}>Temperature</MenuItem>
                            <MenuItem value={'humidity'}>Humidity</MenuItem>
                            

                        </Select>
                        <FormHelperText>Strict</FormHelperText>
                    </FormControl>

                    <FormControl required sx={{ minWidth: 120 }}>
                        <InputLabel>Icon</InputLabel>
                        <Select
                            value={icon}
                            label="Icon *"
                            onChange={(e) => { setIcon(e.target.value) }}
                            error={iconError}
                        >
                            {
                                deviceIcons.map((deviceIcon, idx) => (
                                    <MenuItem key={idx} value={deviceIcon.iconID}>{deviceIcon.icon}</MenuItem>
                                ))
                            }
                        </Select>
                        <FormHelperText>Optional</FormHelperText>
                    </FormControl>
                    <div className=' flex flex-col justify-between gap-5'>
                        <Button type='submit' className='w-full' variant="contained" >Add</Button>
                        <Button onClick={onClose} className='w-full' variant="contained" color='error'>Cancel</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AddMonitorCompo