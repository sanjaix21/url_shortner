import React, { useState } from "react";
import Redirector from "./components/Redirector";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShortenerForm from "./components/ShortenerForm";
import StatsPage from "./components/StatsPage";
import AuthForm from "./components/AuthForm"; // Import AuthForm
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material'; // Import Material UI components

function App() {
  const [token, setToken] = useState<string | null>(null);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    return <AuthForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Container>
        <Routes>
          <Route path="/" element={<ShortenerForm token={token} />} />
          <Route path="/stats" element={<StatsPage token={token} />} />
          {/* Add route for redirection */}
          <Route path="/:shortCode" element={<Redirector />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}

export default App;