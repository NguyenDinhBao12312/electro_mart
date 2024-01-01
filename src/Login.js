import React, { useEffect } from 'react';
import { Avatar, Grid, Paper, TextField } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const usenavigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
  }, []);

  const submit = (event) => {
    event.preventDefault();

    let loginData = { email, password };

    if (alert()) {
      axios
        .post('http://localhost:5050/login', loginData)
        .then((response) => {
          const { message, userId } = response.data;
          if (message === 'Đăng nhập thành công') {
            toast.success(message);
            setToken(userId);
            localStorage.setItem('token', userId);
            usenavigate('/');
          } else {
            toast.error(message);
          }
        })
        .catch((error) => {
          toast.error('Đăng nhập thất bại');
          console.error('Lỗi khi đăng nhập:', error);
        });
    }
  };

  const alert = () => {
    let result = true;
    if (email === '' || email === null) {
      result = false;
      toast.warn('Please enter an email', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    if (password === '' || password === null) {
      result = false;
      toast.warn('Please enter a password', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
    return result;
  };

  const paperStyle = { padding: 20, height: '70vh', width: 300, margin: '20px auto' };
  const avatarStyle = { backgroundColor: 'aqua' };
  const top = { marginTop: '20px' };

  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Grid align='center'>
          <Avatar style={avatarStyle}>
            <LockOutlinedIcon />
          </Avatar>
          <h2>Sign in</h2>
        </Grid>
        <Box component='form' noValidate sx={{ mt: 1 }} name='form1' id='form1' method='post'>
          <TextField label='Email' placeholder='Enter email' variant='standard' value={email} onChange={(e) => setEmail(e.target.value)} type='email' fullWidth required />
          <TextField label='Password' placeholder='Enter password' variant='standard' value={password} onChange={(e) => setPassword(e.target.value)} type='password' fullWidth required />
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
          <Button type='submit' style={top} variant='outlined' onClick={submit} fullWidth>
            Login
          </Button>
          <Grid container justifyContent='flex-end'>
            <Grid item>
              <Link href='/Register' variant='body2' style={{top, textDecoration: 'none', color: 'black', fontWeight: 'bold'}} >
                {'Don\'t have an account? Sign Up'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Grid>
  );
};

export default Login;
