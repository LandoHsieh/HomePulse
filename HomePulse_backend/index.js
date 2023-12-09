import express from 'express'
import passport from 'passport'
import session from 'express-session'
import './src/middleware/passport_config.js'
import mqtt from 'mqtt'
import { requestHeaders, requestTokenValid} from './src/middleware/middleWare.js'
import * as dotenv from 'dotenv'

import googleRoutes from './src/routes/googleRoutes.js'
import deviceRoutes from './src/routes/deviceRoutes.js'
import usersRoutes from './src/routes/usersRoutes.js'
import groupsRoutes from './src/routes/groupsRoutes.js'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'

const app = express()
const PORT = 3000

dotenv.config()

const mqttClient = mqtt.connect('mqtt://test.mosquitto.org')

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker')
    
})

// const server = http.createServer(app)
// const io = new Server(server, {
//     cors: {
//         origin: '*'
//     }
// })

// io.on('connection', (socket) => {
//     console.log('a user connected')
//     socket.on('joinDeviceRoom', ({ userID, deviceID }) => {
//         const roomName = `temp_humi_${userID}_${deviceID}`
//         socket.join(roomName)

//         const topic = `HomePulseMQTT/monitor/temp_humi/${deviceID}`
//         mqttClient.subscribe(topic)

//         mqttClient.on('message', (receivedTopic, message) => {
//             if(receivedTopic === topic){
//                 io.to(roomName.emit('temp_humi', message.toString()))
//             }
//         })
//     })

// })

export { mqttClient }


app.use(cors())
app.use(session({
    secret: process.env.jwt_secret_key,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(passport.initialize())
app.use(passport.session())

app.use('/api/1.0/user', usersRoutes)

app.use('/auth/google', googleRoutes)

app.use('/api/1.0/devices', deviceRoutes)

app.use('/api/1.0/groups', groupsRoutes)

app.get('/', (req, res) => {
    res.send('hello')
})








//記得改為post做身份驗證

app.get('/api/1.0/control/light/:id', (req, res) => {
    const { id } = req.params
    console.log("Light id = ", id)
    const { status } = req.query
    if(status === 'on'){
        mqttClient.publish(topic, '1')
        res.send('Light is on')
    }else if(status === 'off'){
        mqttClient.publish(topic, '2')
        res.send('Light is off')
    }
})

app.get('/api/1.0/control/doorLock/:id', (req, res) => {
    const { id } = req.params
    console.log("DoorLock id = ", id)
    const { status } = req.query
    if(status === 'unlock'){
        mqttClient.publish(topic, '8')
        res.send('Light is on')
    }
    
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})