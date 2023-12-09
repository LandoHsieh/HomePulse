import jwt from 'jsonwebtoken'
import { addToGroup, addUserTeams, getMemberProfile, getMembersDB, getOwnerSpecDevices, getUserTeams, get_logs_history, get_team_info, removeFromGroup, removeUserTeams, store_log } from '../database/homepulseDB.js'

export const genShareLink = (req, res) => {
    const frontend_hostname = process.env.frontend_hostname
    const { userID, name } = req.payload
    const { groupID, groupName } = req.body
    const payload = {
        userID: userID,
        userName: name,
        groupID: groupID,
        groupName: groupName
    }
    const expireTimeSec = 60 * 5 // 1 hour
    const tokenExpiration = Math.floor(Date.now() / 1000) + expireTimeSec
    const group_token = jwt.sign({ payload, exp: tokenExpiration }, process.env.jwt_group_secret_key)
    res.status(200).send(`${frontend_hostname}/invite?token=${group_token}`)
}

export const decryptGroupToken = (req, res) => {
    const { userID } = req.payload
    const { group_token } = req.body

    jwt.verify(group_token, process.env.jwt_group_secret_key, async (err, payload) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                const message = "Group token expired"
                res.status(403).send(message)
                console.log(message)
            } else if (err instanceof jwt.JsonWebTokenError) {
                const message = "Invalid group token"
                console.log(token)
                res.status(403).send(message)
                console.log(message)
            } else {
                res.status(500).send(err)
                console.log(err)
            }
        } else {
            console.log("Group token verified")
            console.log("Group payload: ", payload.payload)
            res.status(200).json(payload.payload)
        }
    })
}

export const add2group = async (req, res) => {
    // userID為受邀者 ownerID為邀請者
    const { userID } = req.payload
    const { ownerID, teamID } = req.body
    await addToGroup(userID, teamID, ownerID)
    await addUserTeams(userID, teamID, ownerID)
    //TODO SQL transaction
    res.status(200).send('add successfully')
}

export const removeMember = async (req, res) => {
    const { userID } =req.payload
    const { ownerID, teamID, memberID } = req.body
    await removeFromGroup(memberID, teamID, ownerID)
    await removeUserTeams(memberID, teamID)
    //TODO SQL transaction
    res.status(200).send('remove successfully')
}

export const getMembers = async (req, res) => {
    const { userID } = req.payload
    const { teamID } = req.query
    const members = await getMembersDB(teamID)
    //console.log("members: ", members)
    res.status(200).json(members)
}

export const getMemberPF = async (req, res) => {
    const { userID } = req.payload
    const { memberID } = req.query
    const memberProfile = await getMemberProfile(memberID)
    console.log("member profile: ", memberProfile)
    res.status(200).json(memberProfile)
}

export const getOwner_SpecDevices = async (req, res) => {
    //此userID為請求者ID
    const { userID } = req.payload
    //TODO 可加上檢查請求者是否在群組內
    const { ownerID, method } = req.body
    const ownerSpecDevices = await getOwnerSpecDevices(ownerID, method)
    res.status(200).json(ownerSpecDevices)
}

export const getTeams = async (req, res) => {
    const { userID } = req.payload
    const userTeams = await getUserTeams(userID)
    
    res.status(200).send(userTeams)
}

export const getTeamInfo = async (req, res) => {
    const { userID } = req.payload
    const { teamID } = req.query
    const teamInfo = await get_team_info(teamID)
    //console.log("team info: ", teamInfo)
    res.status(200).send(teamInfo)
}

export const getTeamLogsHistory = async (req, res) => {
    const { userID } = req.payload
    const { teamID } = req.query
    const logs = await get_logs_history(teamID)
    console.log("logs: ", logs)
    res.status(200).send(logs)
    
}

export const storeLog = async (req, res) => {
    const { userID } = req.payload
    const logInfo = req.body
    await store_log(logInfo)
    //error 儲存log失敗的error handling
    res.status(200).send('ok')
}