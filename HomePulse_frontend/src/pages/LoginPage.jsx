import { useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CottageTwoToneIcon from '@mui/icons-material/CottageTwoTone';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { WindPower } from '@mui/icons-material';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLogin } from '../store/userSlice';
import { setToggle } from '../store/sidebarSlice';




const { VITE_BACKEND_HOST } = import.meta.env

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

//const defaultTheme = createTheme();

const LoginPage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    
    

    //clean localStorage first
    //localStorage.clear()

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (data.get('email') && data.get('password')) {
            axios.post(
                `${VITE_BACKEND_HOST}/api/1.0/user/signin`,
                {
                    provider: "native",
                    email: data.get('email'),
                    password: data.get('password')
                },
                {
                    headers: {
                        "Content-Type": 'application/json'
                    }
                }).then(response => {
                    console.log('Login successful')
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
                    if (error.response.status === 403) {
                        console.log(error.response.data)
                    }
                    else {
                        return
                    }

                })
        }
    };

    const handleGoogleSignin = () => {
        window.location.href = `${VITE_BACKEND_HOST}/auth/google`
        
    }

    return (
        //<ThemeProvider theme={defaultTheme}>
        <div className=' background flex items-center'>

        
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
                    <Avatar sizes='' src='../../src/assets/HomePulseLogo1.PNG' sx={{ m: 1, width:60, height:60, bgcolor: 'secondary.main' } }>
                        {/* <CottageTwoToneIcon /> */}
                       
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Home Pulse
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            variant='filled'
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            variant='filled'
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Button
                            color="secondary"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleGoogleSignin}
                        >
                            Google Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="#" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>

            </Container>
            </div>
        //</ThemeProvider>

    );
}

export default LoginPage