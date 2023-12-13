import React, { useState } from 'react'
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogin } from '../store/userSlice';

const { VITE_BACKEND_HOST } = import.meta.env

const SignUpPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [nameErr, setNameErr] = useState(false)
    const [emailErr, setEmailErr] = useState(false)
    const [pwdErr, setPwdErr] = useState(false)

    const [uppercase, setUppercase] = useState(false)
    const [lowercase, setLowercase] = useState(false)
    const [number, setNumber] = useState(false)
    const [symbol, setSymbol] = useState(false)

    const [emailExisted, setEmailExisted] = useState(false)

    function Copyright(props) {
        return (
            <Typography variant="body2" color="text.secondary" align="center" {...props}>
                {'Copyright © '}
                <Link color="inherit" href="https://github.com/LandoHsieh">
                    HomePulse.com
                </Link>{' '}
                {new Date().getFullYear()}
                {'.'}
            </Typography>
        );
    }

    const signUpValidator = (name, email, password) => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
        //Regex password
        const uppercaseRegex = /[A-Z]/
        const lowercaseRegex = /[a-z]/
        const numberRegex = /[0-9]/
        const symbolRegex = /[~`!@#$%^&*()_\-+={[}\]|:;"'<,>.?/|]/

        setNameErr(false)
        setEmailErr(false)
        setPwdErr(false)
        setUppercase(false)
        setLowercase(false)
        setNumber(false)
        setSymbol(false)

        let nameValidStatus = false
        let pwdValidStatus = false
        let emailValidStatus = false

        if (name.length > 0) {
            nameValidStatus = true
        } else {
            setNameErr(true)
        }

        if (emailRegex.test(email)) {
            emailValidStatus = true
        } else {
            setEmailErr(true)
        }

        let pwdValidCount = 0
        if (uppercaseRegex.test(password)) {
            pwdValidCount++
            setUppercase(true)
        }
        if (lowercaseRegex.test(password)) {
            pwdValidCount++
            setLowercase(true)
        }
        if (numberRegex.test(password)) {
            pwdValidCount++
            setNumber(true)
        }
        if (symbolRegex.test(password)) {
            pwdValidCount++
            setSymbol(true)
        }
        if (pwdValidCount >= 3) {
            pwdValidStatus = true
        } else {
            setPwdErr(true)
        }

        if (nameValidStatus && emailValidStatus && pwdValidStatus) {
            return true
        } else {
            return false
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setEmailExisted(false)
        if (signUpValidator(data.get('name'), data.get('email'), data.get('password'))) {
            axios.post(
                `${VITE_BACKEND_HOST}/api/1.0/user/signup`,
                {
                    name: data.get('name'),
                    email: data.get('email'),
                    password: data.get('password')
                },
                {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }).then(response => {
                    console.log('Sign up successful')
                    const { avatar, email, id, name, teams, devices, role } = response.data.data.user
                    dispatch(
                        setLogin({
                            id: id,
                            name: name,
                            email: email,
                            avatar: avatar,
                            teams: teams,
                            devices: devices,
                            role: role,
                        }))
                    const accessToken = response.data.data.access_token
                    localStorage.setItem('access_token', accessToken)
                    navigate(`/Monitor?token=${accessToken}`)

                }).catch(error => {
                    //error error handling
                    if (error.response.status === 409) {
                        console.log(error.response.data)
                        setEmailExisted(true)
                    } 
                })
            console.log("Sign up info passed!")
        }else{
            console.log("Sign up failed")
        }
       
    }

    const handleGoogleSignup = () => {
        window.location.href = `${VITE_BACKEND_HOST}/auth/google`
    }

    return (
        <div className=' background flex '>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="given-name"
                                    name="name"
                                    required
                                    fullWidth
                                    id="name"
                                    label="Name"
                                    autoFocus
                                    error={nameErr}
                                    helperText={nameErr ? "Cannot be empty" : ""}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    error={emailErr}
                                    helperText={emailErr ? "The email format is not correct." : ""}
                                />
                                <div className={`${emailExisted ? 'flex' : 'hidden'} text-sm text-red-500`}>This email has already been registered.</div>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    error={pwdErr}
                                    helperText={pwdErr ? "The password must contain at least three of below" : ""}
                                />
                                <div className={`${pwdErr ? 'flex flex-col' : 'hidden'} text-base `}>
                                    <div className={`${uppercase ? 'text-green-600' : 'text-gray-500'}`} >•A~Z</div>
                                    <div className={`${lowercase ? 'text-green-600' : 'text-gray-500'}`}>•a~z</div>
                                    <div className={`${number ? 'text-green-600' : 'text-gray-500'}`}>•0~9</div>
                                    <div className={`${symbol ? 'text-green-600' : 'text-gray-500'}`}>•Special character</div>
                                </div>
                            </Grid>



                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive email notifications."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}

                        >
                            Sign Up
                        </Button>
                        <Button
                            color="secondary"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleGoogleSignup}
                            startIcon={<GoogleIcon />}
                        >
                            Google sign up
                        </Button>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/Login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </div>
    )
}

export default SignUpPage