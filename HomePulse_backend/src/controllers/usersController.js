import { 
    createUser, 
    emailExisted, 
    userSignIn, 
    getProvider, 
    userGoogleSignIn, 
    createGoogleUser, 
    getProfile,
    getDevices,
    getSpecDevices
} from '../database/homepulseDB.js'

import jwt from 'jsonwebtoken'

export const signup = async (req, res) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
    //Regex password
    const uppercaseRegex = /[A-Z]/
    const lowercaseRegex = /[a-z]/
    const numberRegex = /[0-9]/
    const symbolRegex = /[~`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/|]/

    const { name, email, password } = req.body
    let nameValidStatus = false
    let pwdValidStatus = false
    let emailValidStatus = false

    if (name.length > 0) {
        nameValidStatus = true
    }

    let pwdValidCount = 0
    if (uppercaseRegex.test(password)) {
        pwdValidCount++
    }
    if (lowercaseRegex.test(password)) {
        pwdValidCount++
    }
    if (numberRegex.test(password)) {
        pwdValidCount++
    }
    if (symbolRegex.test(password)) {
        pwdValidCount++
    }
    if (pwdValidCount >= 3) {
        pwdValidStatus = true
    }

    if (emailRegex.test(email)) {
        if (await emailExisted(email)) {
            res.status(409).send("Email already exists")

        } else {
            emailValidStatus = true
            //TODO 改回密碼格式驗證 未完成
            if (nameValidStatus && emailValidStatus) {
                //TODO 暫時值 未完成
                const provider = "native"
                const avatar = "https://i.pinimg.com/736x/ac/17/e8/ac17e809a2302e4309dff943e85f8f13.jpg"
                const [userId, hashedPassword] = await createUser(name, email, password, provider, avatar)
                //Generate JWT
                const payload = {
                    userID: userId,
                    provider: provider,
                    name: name,
                    email: email,
                    avatar: avatar
                }
                // 1 hour
                const expireTimeSec = 60 * 60
                const tokenExpiration = Math.floor(Date.now() / 1000) + expireTimeSec
                const token = jwt.sign({ payload, exp: tokenExpiration }, process.env.jwt_secret_key)
                res.status(200).json({
                    "data": {
                        "access_token": token,
                        "access_expired": expireTimeSec,
                        "user": {
                            "id": userId,
                            "provider": provider,
                            "name": name,
                            "email": email,
                            "avatar": avatar
                        }
                    }
                })
            } else {
                res.status(400).send("Invalid password or email format.")
            }
        }
    }
}

export const signin = async (req, res) => {
    const { email, password, provider } = req.body
    if (!email || !password || !provider) {
        res.status(400).send("Missing required fields in the request body.")
    } else {
        const [id, name, avatar, teams, role] = await userSignIn(email, password)
        //error DB error handling
        try {
            if (id) {
                //Generate JWT token
                const payload = {
                    userID: id,
                    provider: provider,
                    name: name,
                    email: email,
                    avatar: avatar
                }
                const expireTimeSec = 60 * 60 // 1 hour
                const tokenExpiration = Math.floor(Date.now() / 1000) + expireTimeSec
                const token = jwt.sign({ payload, exp: tokenExpiration }, process.env.jwt_secret_key)
                res.status(200).json(
                    {
                        "data": {
                            "access_token": token,
                            "access_expired": expireTimeSec,
                            "user": {
                                "id": id,
                                "provider": provider,
                                "name": name,
                                "email": email,
                                "avatar": avatar,
                                "teams": teams,
                                "role": role
                            }
                        }
                    }
                )
            } else (
                res.status(403).send("Wrong email or password.")
            )
        } catch (err) {
            res.status(500).send(err)
        }

    }
}

export const token_validate = (req, res) => {
    const {access_token} = req.body
    jwt.verify(access_token, process.env.jwt_secret_key, async (err, payload) => {
        if (err) {
            if (err instanceof jwt.TokenExpiredError) {
                const message = "JWT token expired"
                res.status(403).send(message)
                console.log(message)
            } else if (err instanceof jwt.JsonWebTokenError) {
                const message = "Invalid JWT token"
                console.log(access_token)
                res.status(403).send(message)
                console.log(message)
            } else {
                res.status(500).send(err)
                console.log(err)
            }
        } else {
            console.log("JWT verified")
            res.status(200).send(payload.payload)
        }
    })
}

export const google_signin = async (req, res) => {
    const { name, email, picture } = req.user
    if (await emailExisted(email)) {
        const provider = await getProvider(email)
        //error DB error handling
        if (provider == 'google') {
            console.log("google 登入成功")
            const [id, name, picture] = await userGoogleSignIn(email)
            //error DB error handling
            const payload = {
                userID: id,
                provider: provider,
                name: name,
                email: email,
                avatar: picture
            }
            const expireTimeSec = 60 * 60
            const tokenExpiration = Math.floor(Date.now() / 1000) + expireTimeSec
            const token = jwt.sign({ payload, exp: tokenExpiration }, process.env.jwt_secret_key)
            //FIXME redirect to front end and set token into local storage
            res.redirect(`${process.env.frontend_hostname}/Monitor?token=${token}`)
            /*
            res.status(200).json(
                {
                    "data": {
                        "access_token": token,
                        "access_expired": expireTimeSec,
                        "user": {
                            "id": id,
                            "provider": provider,
                            "name": name,
                            "email": email,
                            "picture": picture
                        }
                    }
                }
            )*/
        } else {
            res.status(400).send("請用native帳號密碼登入")
        }

    } else {
        const [userId, provider] = await createGoogleUser(name, email, picture)
        //error DB error handling
        const payload = {
            userID: userId,
            provider: provider,
            name: name,
            email: email,
            avatar: picture
        }
        const expireTimeSec = 60 * 60
        const tokenExpiration = Math.floor(Date.now() / 1000) + expireTimeSec
        const token = jwt.sign({ payload, exp: tokenExpiration }, process.env.jwt_secret_key)
        console.log("google 註冊成功")
        res.status(200).json({
            "data": {
                "access_token": token,
                "access_expired": expireTimeSec,
                "user": {
                    "id": userId,
                    "provider": provider,
                    "name": name,
                    "email": email,
                    "avatar": picture
                }
            }
        })
    }
}

export const getUserProfile = async (req, res) => {
    const {userID} = req.payload
    const userProfile = await getProfile(userID)
    //error DB error handling
    //console.log("userProfile: ", userProfile)
    res.status(200).json(userProfile)
}

export const getUserDevices = async (req, res) => {
    const {userID} = req.payload
    const userDevices = await getDevices(userID)
    //error DB error handling
    res.status(200).json(userDevices)
}

export const getUserSpecDevices = async (req, res) => {
    const { userID } = req.payload
    const { method } = req.params
    console.log(method)
    const userSpecDevices = await getSpecDevices(userID, method)
    res.status(200).json(userSpecDevices)

}