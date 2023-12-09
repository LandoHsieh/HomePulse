import jwt from 'jsonwebtoken'

export const requestHeaders = (req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
        next()
    } else {
        res.status(400).send("Invalid content type.")
    }
}

export const requestTokenValid = (req, res, next) => {
    const Authorization = req.headers.authorization
    if (typeof Authorization !== 'undefined') {
        const bearerToken = Authorization.split(' ')
        if (bearerToken[0] !== 'Bearer' && bearerToken[0] !== 'bearer') {
            res.status(400).send("Error Authorization format, please follow the example: Bearer Your_APIKey")
        } else {
            const token = bearerToken[1]
            jwt.verify(token, process.env.jwt_secret_key, async (err, payload) => {
                if (err) {
                    if (err instanceof jwt.TokenExpiredError) {
                        const message = "JWT token expired"
                        res.status(403).send(message)
                        console.log(message)
                    } else if (err instanceof jwt.JsonWebTokenError) {
                        const message = "Invalid JWT token"
                        console.log(token)
                        res.status(403).send(message)
                        console.log(message)
                    } else {
                        res.status(500).send(err)
                        console.log(err)
                    }
                } else {
                    console.log("JWT verified")
                    req.token = token
                    req.payload = payload.payload
                    next()
                }
            })
        }
    } else {
        res.status(401).send("No token, or you haven't login yet.")
    }
}

export const checkRole = (req, res, next) => {
    
}
