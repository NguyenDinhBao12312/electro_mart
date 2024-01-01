import React, { useState } from 'react';
import { Avatar, Grid, Paper, TextField } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const isValidate = () => {
    let isproceed = true;
    let errormessage = 'Please enter the value ';
    if (name === null || name === '') {
      isproceed = false;
      errormessage += 'name';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      isproceed = false;
      errormessage += 'Email ';
    }
    if (password === null || password === '') {
      isproceed = false;
      errormessage += 'Password';
    }
    if (!isproceed) {
      toast.warn(errormessage)
    }
    return isproceed;
  }
  const submit = (event) => {
    event.preventDefault();
    let regobj = { name, email, password };
    if (isValidate()) {
      axios
        .post('http://localhost:5050/register', regobj)
        .then((response) => {
          if(response.data.exists){
            toast.warn('email đã tồn tại')
          }
            toast.success('Sign Up Success', {
              position: toast.POSITION.TOP_CENTER,
            });
          navigate('/login');
        })
        .catch((err) => {
          toast.error('email đã tồn tại', {
            position: toast.POSITION.TOP_CENTER,
          });
        });
    }
  };
  const paperStyle = { padding: 20, height: '70vh', width: 300, margin: "20px auto" }
  const avatarStyle = { backgroundColor: 'aqua' }
  const top = { marginTop: '20px' }
  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}><LockOutlinedIcon /></Avatar>
          <h2>Sign up</h2>
        </Grid>
        <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }} name="form1" id="form1" method="post">
          <TextField label='name' placeholder='Enter name' variant="standard" value={name} onChange={event => setName(event.target.value)} fullWidth required />
          <TextField label='Email' placeholder='Enter email' variant="standard" type='email' value={email} onChange={event => setEmail(event.target.value)} fullWidth required />
          <TextField label='Password' placeholder='Enter password' variant="standard" type='password' value={password} onChange={event => setPassword(event.target.value)} fullWidth required />
          <ToastContainer />
          <Button type='submit' style={top} variant="outlined" fullWidth>Register</Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/login' variant='body2' style={{top, textDecoration: 'none', color: 'black', fontWeight: 'bold'}} >
                {'Do you have an account? Log in now'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  )
}
export default Register;