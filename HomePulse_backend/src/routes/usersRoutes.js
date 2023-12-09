import express from 'express'
import {getUserDevices, getUserProfile, getUserSpecDevices, google_signin, signin, signup, token_validate} from '../controllers/usersController.js'
import { requestHeaders, requestTokenValid} from '../middleware/middleWare.js'

const router = express.Router()
router.use(express.json())

// '/api/1.0/user'


router.post('/signup', requestHeaders, signup)

router.post('/signin', requestHeaders, signin)

router.post('/token_validate', requestHeaders, token_validate)

router.get('/google/signin', google_signin)

router.get('/get/profile', requestTokenValid, getUserProfile)

router.get('/get/devices', requestTokenValid, getUserDevices)

router.get('/get/spec_devices/:method', requestTokenValid, getUserSpecDevices)

export default router