
import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Alert } from '@mui/material';

interface AuthFormProps {
  onLoginSuccess: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onLoginSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [githubUsername, setGithubUsername] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [clientID, setClientID] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const url = isRegister ? 'http://localhost:3001/evaluation-service/register' : 'http://localhost:3001/evaluation-service/auth';
    const body = isRegister
      ? { email, name, mobileNo, githubUsername, rollNo, accessCode }
      : { email, name, rollNo, accessCode, clientID, clientSecret };

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
          // If registration is successful, pre-fill clientID and clientSecret for login
          setClientID(data.clientID);
          setClientSecret(data.clientSecret);
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
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label="Roll No"
            fullWidth
            margin="normal"
            value={rollNo}
            onChange={(e) => setRollNo(e.target.value)}
            required
          />
          <TextField
            label="Access Code"
            fullWidth
            margin="normal"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            required
          />
          {isRegister && (
            <>
              <TextField
                label="Mobile No"
                fullWidth
                margin="normal"
                value={mobileNo}
                onChange={(e) => setMobileNo(e.target.value)}
                required
              />
              <TextField
                label="GitHub Username"
                fullWidth
                margin="normal"
                value={githubUsername}
                onChange={(e) => setGithubUsername(e.target.value)}
                required
              />
            </>
          )}
          {!isRegister && (
            <>
              <TextField
                label="Client ID"
                fullWidth
                margin="normal"
                value={clientID}
                onChange={(e) => setClientID(e.target.value)}
                required
              />
              <TextField
                label="Client Secret"
                fullWidth
                margin="normal"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                required
              />
            </>
          )}
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
