import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import DeviceIcon from '../controllerPage/DeviceIcon'
import { useSocket } from './SocketComponent'


const { VITE_WEBSOCKET_HOST } = import.meta.env
const SOCKET_SERVER_URL = `${VITE_WEBSOCKET_HOST}`

const MonitorCompo = ({ userID, device }) => {
    const deviceID = device.deviceID
    const type = device.type
    const [monitorData, setMonitorData] = useState({})
    const [deviceTypeData, setDeviceTypeData] = useState('')
    const [temperature, setTemperature] = useState('')
    const [humidity, setHumidity] = useState('')
    const socket = useSocket()

    useEffect(() => {
        
        // const socket = io(SOCKET_SERVER_URL)

        // socket.emit('joinDeviceRoom', { userID, deviceID, type })

        // socket.on('temp_humi', (data) => {
        //     //  console.log(data)
        //     //  setMonitorData(data)
        //     const formattedData = JSON.parse(data)
        //     console.log(formattedData)


        //     setMonitorData(formattedData)
        //     const { [device.type]: typeData } = formattedData
        //     setDeviceTypeData(typeData)
        // })

        // return () => {
        //     socket.disconnect()
        // }
        // console.log(socket)
        if (socket) {
            
            socket.emit('joinDeviceRoom', { userID, deviceID, type })
            
            socket.on('temp_humi', (data) => {
                //  console.log(data)
                //  setMonitorData(data)
                const formattedData = JSON.parse(data)
                console.log(formattedData)
                setMonitorData(formattedData)
                if (type === 'temperature') {
                    setTemperature(formattedData.temperature)
                    setHumidity(formattedData.humidity)
                } else {
                    const { [device.type]: typeData } = formattedData
                    setDeviceTypeData(typeData)
                }

            })
            return () => {
                socket.emit('leaveDeviceRoom', { userID, deviceID, type })
                socket.off('temp_humi')
                socket.disconnect()
            }
        }

    }, [userID, device.deviceID, type, socket])

    return (
        <div>
            {
                type === 'temperature' ?
                    <div id="device" className={`flex flex-col justify-center w-[163px] h-[136px] gap-3 bg-white rounded-[25px] shadow-inner border border-slate-200 border-opacity-80 p-[14px]`}>
                        <div className='flex justify-center text-lg font-medium'>{device.deviceName}</div>
                        <div id='temp' className='flex justify-center'>
                            <DeviceIcon iconID={device.iconID} />
                            
                            <div className={``} >{temperature || '-- ˚C'}</div>
                        </div>
                        <div id='humi' className='flex justify-center'>
                            <DeviceIcon iconID='1006' />
                            <div className={``} >{humidity || '-- %'}</div>
                        </div>
                    </div>
                    :
                    <div id="device" className={`flex justify-between w-[163px] h-[136px] bg-white rounded-[25px] shadow-inner border border-slate-200 border-opacity-80 p-[14px]`}>
                        <div id='left' className='flex flex-col justify-between'>
                            <DeviceIcon iconID={device.iconID} />
                            <div className={``} >{device.deviceName}</div>
                            <div className={``} >{deviceTypeData || '-- ˚C'}</div>
                        </div>
                    </div>
            }
        </div>


        // <div id="device" className={`flex justify-between w-[163px] h-[136px] bg-white rounded-[25px] shadow-inner border border-slate-200 border-opacity-80 p-[14px]`}>
        //     <div id='left' className='flex flex-col justify-between'>
        //         <DeviceIcon iconID={device.iconID} />
        //         <div className={``} >{device.deviceName}</div>
        //         <div className={``} >{deviceTypeData || '-- ˚C'}</div>
        //     </div>
        // </div>

    )
}

export default MonitorCompo