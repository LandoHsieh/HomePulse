import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import mqtt from 'mqtt'
import { instrument } from '@socket.io/admin-ui'
import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3002

app.get('/', (req, res) =>{
    res.send('hello socket')
})

const mqttClient = mqtt.connect(process.env.mqtt_broker)

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker')

})

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        //origin: [process.env.frontend_hostname, process.env.socket_admin_hostname],
        credentials: true,
        origin: '*'
    },
    secure: true,
    transports: ['websocket', 'polling' ]    
})
instrument(io, { auth: false, mode: "development" })

io.on('connection', (socket) => {

    console.log('a user connected')
    
    socket.on('joinDeviceRoom', ({ userID, deviceID, type }) => {
        const roomName = `${type}_${userID}_${deviceID}`
        console.log(socket.rooms)
        
        if (!socket.rooms.has(roomName)) {
            console.log('this room does not exist')
            socket.join(roomName)
            
            //FIXME 要把topic的temp_humi改成${type}
            const topic = `${process.env.mqtt_monitor}/temp_humi/${deviceID}`
            mqttClient.subscribe(topic)

            mqttClient.on('message', (receivedTopic, message) => {
                if (receivedTopic === topic) {
                    
                    io.to(roomName).emit('temp_humi', message.toString())
                }
            })
        } else {
            console.log("room exist")
        }

    })
    socket.on('leaveDeviceRoom', ({ userID, deviceID, type }) => {
        const roomName = `${type}_${userID}_${deviceID}`
        const topic = `${process.env.mqtt_monitor}/temp_humi/${deviceID}`
        console.log(`Leaving room : ${roomName}`)
        
        mqttClient.unsubscribe(topic, (err) => {
            if (err) {
                console.error(`Unsubscribe error for topic`, err);
            } else {
                console.log(`Unsubscribed topic`);
            }
        })
        socket.leave(roomName)
    })
    socket.on('disconnect', () => {
        console.log("a user disconnected")
    })

    socket.on('joinLogsRoom', ({teamID}) => {
        console.log(teamID)
        const roomName = `HomePulse_Logs_${teamID}`
        socket.join(roomName)
    })

    socket.on('newLogMessage', ({teamID, logMessage}) => {
        const roomName = `HomePulse_Logs_${teamID}`
        console.log(logMessage)
        io.to(roomName).emit('logMessage', logMessage)
    })

    socket.on('leaveLogsRoom', ({teamID}) => {
        const roomName = `HomePulse_Logs_${teamID}`
        socket.leave(roomName)
    })

})


server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

