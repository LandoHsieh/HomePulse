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

const mqttClient = mqtt.connect(process.env.mqtt_broker)

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker')
    
})

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})