import passport from 'passport'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import * as dotenv from 'dotenv'
const users = {}
dotenv.config()
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.google_clientID,
            clientSecret: process.env.google_client_key,
            callbackURL: `${process.env.hostname}/auth/google/callback`
        },
        (accessToken, refreshToken, profile, done) => {
            
            if(profile._json){
                const id = profile._json.sub
                users[id] = profile._json
                //console.log(profile._json)

                return done(null, users[id])
            }else{
                return done(null, false)
            }
        }
    )
)


passport.serializeUser((user, done)=>{
    return done(null, user.sub)
})

passport.deserializeUser((userId, done)=>{
    const user = users[userId]
    done(null, user)
})
