import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Container, Typography, Button, Box, Snackbar, Alert, Backdrop, CircularProgress } from "@mui/material";
import { gql, useMutation } from '@apollo/client';

const LOGIN_MUTATION = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [login, { loading, error }] = useMutation(LOGIN_MUTATION);

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await login({ variables: { username, password } });

      localStorage.setItem('token', result.data.login.token);
      navigate('/dashboard');
      setSnackbarMessage('Login successfully!');
    } catch (e) {
      setSnackbarMessage(`Authentication error: ${error?.message}`);
      setSnackbarSeverity("error");

    } finally {
      setSnackbarOpen(true);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: '100vh' }}>
      <Container maxWidth="xs">
        <Typography variant="h4" align="center" gutterBottom>
          Admin Login
        </Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          fullWidth
          margin="normal"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>
        <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 1 })}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default Login;
