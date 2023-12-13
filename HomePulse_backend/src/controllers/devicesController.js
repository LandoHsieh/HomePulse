import { mqttClient } from '../../index.js'
import { addDevice, removeDevice } from '../database/homepulseDB.js'
import * as dotenv from 'dotenv'

dotenv.config()

export const add_device = async (req, res) => {
    const { userID } = req.payload
    const { deviceID, deviceName, type, method, iconID, switchType } = req.body
    const result = await addDevice(userID, deviceID, deviceName, type, method, iconID, switchType)
    if (result === 'ER_DUP_ENTRY') {
        res.status(409).send("This device has already been registered.")
    } else {
        res.status(200).send("create successfully")
    }

}

export const remove_device = async (req, res) => {
    const { userID } = req.payload
    const { deviceID } = req.body
    const removeResult = await removeDevice(userID, deviceID)
    //error DB error handling
    console.log("remove result: ", removeResult)
    res.status(200).send("remove successfully")
}

export const lightControl = (req, res) => {
    //error 取不到userID的Error handling，必免有人繞過jwt檢驗
    const { userID } = req.payload
    const { deviceID, status } = req.body
    if (userID) {
        const topic = `${process.env.mqtt_controller}/light/${deviceID}`
        mqttClient.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Subscribed to topic light`)
            } else {
                console.log('Subscribed error: ', err)
            }
        })

        if (status === 'on') {
            mqttClient.publish(topic, '1')
            res.status(200).send('Light is on')
        } else if (status === 'off') {
            mqttClient.publish(topic, '2')
            res.status(200).send('Light is off')
        }
    } else {
        res.status(401).send('Cannot get userID.')
    }



}

export const doorLockControl = (req, res) => {
    const { userID } = req.payload
    if (userID) {
        const { deviceID } = req.body
        const topic = `${process.env.mqtt_controller}/doorLock/${deviceID}`
        mqttClient.subscribe(topic, (err) => {
            if (!err) {
                console.log(`Subscribed to topic doorLock`)
            } else {
                console.log('Subscribed error: ', err)
            }
        })
        mqttClient.publish(topic, '8')
        // mqttClient.unsubscribe(topic, (err) => {
        //     if (err) {
        //         console.error(`Unsubscribe error for topic ${topic}:`, err);
        //     } else {
        //         console.log(`Unsubscribed from topic ${topic}`);
        //     }
        // })
        res.status(200).send('Door unlocked!')
    } else {
        res.status(401).send('Cannot get userID.')
    }
}

export const temperatureMonitor = (req, res) => {
    const { userID } = req.payload
    if (!userID) {
        res.status(401).send('Cannot get userID.')
    }
    const { deviceID } = req.body
    const topic = `${process.env.mqtt_monitor}/temp_humi/${deviceID}`

    new Promise((resolve, reject) => {
        mqttClient.subscribe(topic, (err) => {
            if (err){
                console.log('Subscribe error: ', err)
                return reject(err)
            }
            console.log(`Subscribed to topic temp_humi`)

            mqttClient.on('message', (receivedTopic, message) => {
                if(receivedTopic === topic){
                    console.log(message.toString())
                    mqttClient.unsubscribe(topic)
                    resolve(message.toString())
                }
            })
        })
    }).then(message => {
        res.status(200).send(message)
    }).catch(error => {
        res.status(500).send('Subscription failed.')
    })
}

export const humidityMonitor = (req, res) => {
    const { userID } = req.payload
    if (userID) {
        const { deviceID } = req.body

    } else {
        res.status(401).send('Cannot get userID.')
    }
}