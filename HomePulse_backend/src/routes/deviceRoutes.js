import express from 'express'
import { requestHeaders, requestTokenValid} from '../middleware/middleWare.js'
import { add_device, doorLockControl, lightControl, remove_device, temperatureMonitor } from '../controllers/devicesController.js'
const router = express.Router()
router.use(express.json())

// '/api/1.0/devices'
router.post('/add_device', requestTokenValid, add_device)

router.delete('/remove_device', requestTokenValid, remove_device)


//router.post('/control/light', requestTokenValid)
router.post('/control/light', requestTokenValid, lightControl)

router.post('/control/doorLock', requestTokenValid, doorLockControl)

router.post('/monitor/temperature', requestTokenValid, temperatureMonitor)
export default router