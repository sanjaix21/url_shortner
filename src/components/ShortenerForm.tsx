import React, { useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { Log } from "../middleware/logger";
import { saveShortUrl } from "../utils/storage";

interface ShortUrl {
  originalUrl: string;
  shortCode: string;
  expiry: string;
  shortUrl: string;
}

const defaultValidity = 30; // minutes

const ShortenerForm: React.FC<{ token: string }> = ({ token }) => {
  const [inputs, setInputs] = useState([
    { longUrl: "", validity: "", shortCode: "" },
  ]);
  const [results, setResults] = useState<ShortUrl[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  type InputField = "longUrl" | "validity" | "shortCode";

  const handleChange = (idx: number, field: InputField, value: string) => {
    const updated = [...inputs];
    updated[idx][field] = value;
    setInputs(updated);
  };

  const addInputRow = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { longUrl: "", validity: "", shortCode: "" }]);
    }
  };

  const removeInputRow = (idx: number) => {
    const updated = inputs.filter((_, i) => i !== idx);
    setInputs(updated);
  };

  const validateUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccessMessage(null);
    const newResults: ShortUrl[] = [];

    for (let i = 0; i < inputs.length; i++) {
      const { longUrl, validity, shortCode } = inputs[i];

      if (!longUrl || !validateUrl(longUrl)) {
        setError("Invalid URL at row " + (i + 1));
        await Log("frontend", "error", "component", `Invalid URL entered: ${longUrl}`, token);
        return;
      }
      if (validity && isNaN(Number(validity))) {
        setError("Validity must be a number at row " + (i + 1));
        await Log("frontend", "warn", "component", `Non-numeric validity: ${validity}`, token);
        return;
      }
      // Client-side check for custom shortcode format
      if (shortCode && !/^[a-zA-Z0-9]{4,10}$/.test(shortCode)) {
        setError("Custom short code must be alphanumeric and between 4-10 characters long at row " + (i + 1));
        await Log("frontend", "warn", "component", `Invalid custom shortcode format: ${shortCode}`, token);
        return;
      }
      // Check for duplicate shortcodes if provided (client-side only for current form)
      if (shortCode && inputs.some((inp, j) => inp.shortCode === shortCode && i !== j)) {
        setError("Duplicate custom shortcode in form at row " + (i + 1));
        await Log("frontend", "warn", "component", `Duplicate custom shortcode in form: ${shortCode}`, token);
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/shorten', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            originalUrl: longUrl,
            validityMinutes: validity ? Number(validity) : defaultValidity,
            customShortCode: shortCode || undefined,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          newResults.push(data);
          saveShortUrl([data]); // persist each successful short URL
          await Log("frontend", "info", "component", `URL shortened successfully: ${data.shortUrl}`, token);
        } else {
          setError(data.message || 'An error occurred during shortening.');
          await Log("frontend", "error", "component", `URL shortening failed: ${data.message || 'Unknown error'}`, token);
          return; // Stop processing if one fails
        }
      } catch (err) {
        setError('Network error or server is unreachable.');
        await Log("frontend", "fatal", "component", `Network error during URL shortening: ${err}`, token);
        return; // Stop processing if network error
      }
    }
    setResults(newResults);
    setSuccessMessage("All URLs shortened successfully!");
    setInputs([{ longUrl: "", validity: "", shortCode: "" }]); // Reset form
  };

  return (
    <Box sx={{ mt: 4, p: 3, border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <Typography variant="h5" component="h2" gutterBottom>Shorten URLs</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      {inputs.map((input, idx) => (
        <Box key={idx} display="flex" gap={2} mb={2} alignItems="center">
          <TextField
            label="Long URL"
            fullWidth
            value={input.longUrl}
            onChange={e => handleChange(idx, "longUrl", e.target.value)}
            required
          />
          <TextField
            label="Validity (min)"
            type="number"
            value={input.validity}
            onChange={e => handleChange(idx, "validity", e.target.value)}
            sx={{ width: '150px' }}
          />
          <TextField
            label="Custom Shortcode"
            value={input.shortCode}
            onChange={e => handleChange(idx, "shortCode", e.target.value)}
            sx={{ width: '200px' }}
            helperText="4-10 alphanumeric chars (optional)"
          />
          {inputs.length > 1 && (
            <Button variant="outlined" color="error" onClick={() => removeInputRow(idx)}>
              Remove
            </Button>
          )}
        </Box>
      ))}
      {inputs.length < 5 && (
        <Button variant="outlined" onClick={addInputRow} sx={{ mb: 2 }}>
          Add Another URL
        </Button>
      )}
      <Button variant="contained" onClick={handleSubmit} fullWidth>
        Shorten
      </Button>

      {results.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">Shortened URLs</Typography>
          {results.map((res, idx) => (
            <Box key={idx} sx={{ mb: 1, p: 1, border: '1px solid #eee', borderRadius: '4px' }}>
              <Typography variant="body1">Original: {res.originalUrl}</Typography>
              <Typography variant="body1">Short URL: <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">{res.shortUrl}</a></Typography>
              <Typography variant="body2" color="text.secondary">Expires: {new Date(res.expiry).toLocaleString()}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ShortenerForm;