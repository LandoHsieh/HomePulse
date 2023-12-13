import mysql from 'mysql2'
import * as dotenv from 'dotenv'
import bcrypt from 'bcrypt'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.host,
    port: process.env.port,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
}).promise()

const connection = await pool.getConnection()


export async function createUser(name, email, password, provider, avatar) {
    const userId = Math.floor(Math.random() * 9000000000) + 1000000000

    const teams = []
    
    const teamID = Math.floor(Math.random() * 9000000000) + 1000000000
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    const role = 'user'
    
    const member = [{"role":"admin","userID":userId}]

    const create_user = await pool.query(
        "insert into Users (userID, userName, email, password, role, avatar, teams, provider, teamID, teamName) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ? )",
        [userId, name, email, hashedPassword, role, avatar, JSON.stringify(teams), provider, teamID, `${name}'s Home`]
    )
    const create_team = await pool.query(
        "insert into Teams (teamID, teamName, ownerID, member, devices) values (?, ?, ?, ?, ?)",
        [teamID, `${name}'s Home`, userId, JSON.stringify(member), '[]']
    )

    return [userId, teams, role]

}

export async function userSignIn(email, password) {
    const result = await pool.query("select * from Users where email = ?", [email])
    if (result[0].length == 1) {
        const hashedPassword = result[0][0].password
        const passwordValid = bcrypt.compareSync(password, hashedPassword)
        if (passwordValid) {
            const { userID, userName, avatar, teams, role } = result[0][0]
            return [userID, userName, avatar, teams, role]
        } else {
            return []
        }
    } else {
        return result[0]
    }
}

export async function emailExisted(email) {
    const result = await pool.query("select * from Users where email = ?", [email])
    if (result[0].length > 0) {
        return (true)
    } else {
        return (false)
    }
}

export async function getProvider(email) {
    const result = await pool.query("select * from Users where email = ?", [email])
    return result[0][0].provider
}

export async function userGoogleSignIn(email) {
    const result = await pool.query("select * from Users where email = ?", [email])
    return [result[0][0].userID, result[0][0].userName, result[0][0].avatar]
}

export async function createGoogleUser(name, email, avatar) {
    const provider = "google"
    const password = null
    const teams = []
    const teamID = Math.floor(Math.random() * 9000000000) + 1000000000
    const userId = Math.floor(Math.random() * 9000000000) + 1000000000
    const role = 'user'
    const member = [{"role":"admin","userID":userId}]
    const create_user = await pool.query(
        "insert into Users (userID, userName, email, role, avatar, teams, provider, teamID, teamName) values (?, ?, ?, ?, ?, ?, ?, ?, ? )",
        [userId, name, email, role, avatar, JSON.stringify(teams), provider, teamID, `${name}'s Home`]
    )
    const create_team = await pool.query(
        "insert into Teams (teamID, teamName, ownerID, member, devices) values (?, ?, ?, ?, ?)",
        [teamID, `${name}'s Home`, userId, JSON.stringify(member), '[]']
    )
    return [userId, provider]
}

export async function getProfile(userID) {
    const result = await pool.query("select userID, userName, email, role, avatar, teams, teamID, teamName from Users where userID = ?", [userID])
    return result[0][0]
}

export async function getMemberProfile(userID){
    const result = await pool.query("select userName, avatar from Users where userID = ? ", [userID])
    return result[0][0]
}

export async function getDevices(userID) {
    const result = await pool.query("select * from userDevices where userID = ?", [userID])
    //console.log("getUsersDevices: ", result[0])
    return result[0]
}

export async function getSpecDevices(userID, method) {
    const result = await pool.query("select * from userDevices where userID = ? and method = ?", [userID, method])
    return result[0]
}

export async function addDevice(userID, deviceID, deviceName, type, method, iconID, switchType) {
    try {
        const result = await pool.query(
            "insert into userDevices (deviceID, deviceName, type, method, iconID, userID, switch) values (?, ?, ?, ?, ?, ?, ?)",
            [deviceID, deviceName, type, method, iconID, userID, switchType]
        )
        return result[0]
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY'){
            return error.code
        }
        
    } 
    
}

export async function removeDevice(userID, deviceID) {
    const result = await pool.query("delete from userDevices where userID = ? and deviceID = ?", [userID, deviceID])
    return result[0]
}

export async function addToGroup(userID, teamID, ownerID) {
    const members = await pool.query("select member from Teams where teamID = ? and ownerID = ?", [teamID, ownerID])
    members[0][0].member.push(
        {
            userID: userID,
            role: "user"
        }
    )
    const newMembers = await pool.query("update Teams set member = ? where teamID = ? ", [JSON.stringify(members[0][0].member), teamID])
    //ERROR 新增失敗的error handling
}

export async function addUserTeams(userID, teamID, ownerID){
    const teams = await pool.query("select teams from Users where userID = ?", [userID])
    teams[0][0].teams.push(
        {
            teamID: teamID,
            ownerID: ownerID
        }
    )
    const newTeams = await pool.query("update Users set teams = ? where userID = ?", [JSON.stringify(teams[0][0].teams), userID])
    //ERROR 新增失敗的error handling
}

export async function removeFromGroup(memberID, teamID, ownerID){
    const members = await pool.query("select member from Teams where teamID = ? and ownerID = ?", [teamID, ownerID])
    const memberList = members[0][0].member

    const index = memberList.findIndex(member => member.userID === memberID)

    if(index !== -1){
        memberList.splice(index, 1)
    }
    const newMembers = await pool.query("update Teams set member = ? where teamID = ?", [JSON.stringify(memberList), teamID])
    //ERROR 刪除失敗的error handling 
}

export async function removeUserTeams(memberID, teamID){
    const teams = await pool.query("select teams from Users where userID = ?", [memberID])
    const teamsList = teams[0][0].teams

    const index = teamsList.findIndex(team => team.teamID === teamID)

    if(index !== -1){
        teamsList.splice(index, 1)
    }
    const newTeams = await pool.query("update Users set teams = ? where userID = ?", [JSON.stringify(teamsList), memberID])
    //ERROR 刪除失敗的error handling 
}

export async function getMembersDB(teamID) {
    const members = await pool.query("select member from Teams where teamID = ?", [teamID])
    return members[0][0].member
}

export async function getOwnerSpecDevices(ownerID, method) {
    const result = await pool.query("select * from userDevices where userID = ? and method = ?", [ownerID, method])
    return result[0]
}

export async function get_owner_name(ownerID){
    const ownerName = await pool.query("select userName from Users where userID = ?", [ownerID])
    // console.log(ownerName[0])
    return ownerName[0][0].userName
}

export async function getUserTeams(userID) {
    const result = await pool.query("select teams from Users where userID = ?", [userID])
    return result[0][0].teams
}

export async function get_team_info(teamID){
    const result = await pool.query("select * from Teams where teamID = ?", [teamID])
    return result[0][0]
}

export async function get_logs_history(teamID){
    const result = await pool.query("select * from usageLogs where teamID = ?", [teamID])
    return result[0]
}

export async function store_log(logInfo){
    const result = await pool.query("insert into usageLogs (teamID, userID, userName, event, createAt) values (?, ?, ?, ?, ?)", [logInfo.teamID, logInfo.userID, logInfo.userName, logInfo.event, logInfo.createAt])
}


