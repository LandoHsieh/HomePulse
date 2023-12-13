import express from 'express'
import { requestHeaders, requestTokenValid} from '../middleware/middleWare.js'
import { add2group, decryptGroupToken, genShareLink, getMemberPF, getMembers, getOwnerName, getOwner_SpecDevices, getTeamInfo, getTeamLogsHistory, getTeams, removeMember, storeLog } from '../controllers/groupsController.js'

const router = express.Router()
router.use(express.json())

// 'api/1.0/groups

router.post('/genShareLink', requestTokenValid, genShareLink)

router.post('/validate/group_token', requestTokenValid, decryptGroupToken)

router.post('/invite/add2group', requestTokenValid, add2group)

router.delete('/removeMember', requestTokenValid, removeMember)

router.get('/getMembers', requestTokenValid, getMembers)

router.get('/getMemberProfile', requestTokenValid, getMemberPF)

router.post('/getOwner/spec_devices', requestTokenValid, getOwner_SpecDevices)

router.get('/getTeams', requestTokenValid, getTeams )

router.get('/getTeamInfo', requestTokenValid, getTeamInfo)

router.get('/getTeamLogsHistory', requestTokenValid, getTeamLogsHistory)

router.post('/storeLog', requestTokenValid, storeLog)

router.get('/getOwnerName', requestTokenValid, getOwnerName)

export default router