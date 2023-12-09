import express from 'express'
import passport from 'passport'

import '../middleware/passport_config.js'
const router = express.Router()

// '/auth/google'

router.get('/', passport.authenticate('google', {
    scope: ['email', 'profile']
}))

router.get('/callback', passport.authenticate('google', {
    successRedirect: `${process.env.nginx_dir}api/1.0/user/google/signin`,
    failureRedirect: `${process.env.nginx_dir}failure`
}))

router.get('/failure', (req, res) => {
    res.send('google signin failed')
})
export default router