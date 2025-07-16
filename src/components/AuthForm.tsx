
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

interface AuthFormProps {
  onLoginSuccess: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const url = isRegister ? 'http://localhost:3001/evaluation-service/register' : 'http://localhost:3001/evaluation-service/auth';
    const body = { username, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || (isRegister ? 'Registration successful! Please log in.' : 'Login successful!') });
        if (!isRegister) {
          onLoginSuccess(data.access_token);
        } else {
          setIsRegister(false); // Switch to login form
        }
      } else {
        setMessage({ type: 'error', text: data.message || 'An error occurred.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error or server is unreachable.' });
      console.error('Auth error:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {isRegister ? 'Register' : 'Login'}
        </Typography>
        {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
            {isRegister ? 'Register' : 'Login'}
          </Button>
          <Button
            type="button"
            variant="text"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AuthForm;
