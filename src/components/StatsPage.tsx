import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert, Paper, List, ListItem, ListItemText } from "@mui/material";
import { Log } from "../middleware/logger";

interface ShortUrlStat {
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
  expiry: string;
  totalClicks: number;
  detailedClicks: Array<{ timestamp: string; source: string; ip: string }>;
}

const StatsPage: React.FC<{ token: string }> = ({ token }) => {
  const [stats, setStats] = useState<ShortUrlStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStats(data);
          await Log("frontend", "info", "component", "Fetched URL statistics successfully", token);
        } else {
          setError(data.message || 'Failed to fetch statistics.');
          await Log("frontend", "error", "component", `Failed to fetch URL statistics: ${data.message || 'Unknown error'}`, token);
        }
      } catch (err) {
        setError('Network error or server is unreachable.');
        await Log("frontend", "fatal", "component", `Network error fetching URL statistics: ${err}`, token);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" component="h2" gutterBottom>URL Statistics</Typography>
      {stats.length === 0 ? (
        <Typography>No shortened URLs to display yet.</Typography>
      ) : (
        <List>
          {stats.map((urlStat) => (
            <Paper key={urlStat.shortCode} sx={{ mb: 2, p: 2 }}>
              <ListItem disableGutters>
                <ListItemText
                  primary={
                    <Typography variant="h6">
                      Short URL: <a href={urlStat.shortUrl} target="_blank" rel="noopener noreferrer">{urlStat.shortUrl}</a>
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">Original: {urlStat.originalUrl}</Typography>
                      <Typography variant="body2">Created: {new Date(urlStat.createdAt).toLocaleString()}</Typography>
                      <Typography variant="body2">Expires: {new Date(urlStat.expiry).toLocaleString()}</Typography>
                      <Typography variant="body2">Total Clicks: {urlStat.totalClicks}</Typography>
                    </>
                  }
                />
              </ListItem>
              {urlStat.detailedClicks.length > 0 && (
                <Box sx={{ mt: 2, ml: 2 }}>
                  <Typography variant="subtitle1">Click Details:</Typography>
                  <List dense>
                    {urlStat.detailedClicks.map((click, clickIdx) => (
                      <ListItem key={clickIdx} disableGutters>
                        <ListItemText
                          primary={`Timestamp: ${new Date(click.timestamp).toLocaleString()}`}
                          secondary={`Source: ${click.source || 'N/A'}, IP: ${click.ip || 'N/A'}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default StatsPage;