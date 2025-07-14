import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Typography, Box, CircularProgress, Alert } from '@mui/material';

const Redirector: React.FC = () => {
  const { shortCode } = useParams<{ shortCode?: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (shortCode) {
      const redirect = async () => {
        try {
          const response = await fetch(`http://localhost:3001/${shortCode}`);
          // The backend will handle the actual redirection with a 302 status.
          // If it returns a non-redirect status (e.g., 404, 410), we handle it here.
          if (!response.ok) {
            const message = await response.text();
            setError(message || `Failed to redirect for short code: ${shortCode}`);
          }
        } catch (err) {
          setError('Network error or server is unreachable.');
          console.error('Redirect error:', err);
        } finally {
          setLoading(false);
        }
      };
      redirect();
    } else {
      setError('No short code provided for redirection.');
      setLoading(false);
    }
  }, [shortCode]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Redirecting...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return null; // Component will not render anything if redirection is successful
};

export default Redirector;