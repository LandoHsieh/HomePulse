import express from 'express'
import { Server } from 'socket.io'
import http from 'http'
import mqtt from 'mqtt'
import { instrument } from '@socket.io/admin-ui'
import axios from 'axios'


const app = express()
const PORT = 3001

const mqttClient = mqtt.connect('mqtt://test.mosquitto.org')

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker')

})

const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173', "https://admin.socket.io"],
        credentials: true
        //origin: '*'
    }
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
            const topic = `HomePulseMQTT/monitor/temp_humi/${deviceID}`
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
        const topic = `HomePulseMQTT/monitor/temp_humi/${deviceID}`
        console.log(`Leaving room : ${roomName}`)
        
        mqttClient.unsubscribe(topic, (err) => {
            if (err) {
                console.error(`Unsubscribe error for topic ${topic}:`, err);
            } else {
                console.log(`Unsubscribed from topic ${topic}`);
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

