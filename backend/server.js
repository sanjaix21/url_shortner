
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors

const app = express();
const PORT = 3001; // Using a different port for the backend

app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Placeholder for user data (in-memory for now)
const users = [];

// Placeholder for URL data (in-memory for now)
const urls = {}; // shortCode -> { originalUrl, expiry, clicks: [], createdAt }

// Placeholder for logs (in-memory for now)
const logs = [];

// Helper to generate a unique short code
const generateShortCode = () => {
    let code;
    do {
        code = Math.random().toString(36).substring(2, 8); // 6 character alphanumeric
    } while (urls[code]);
    return code;
};

// Middleware to verify authentication token (simplified for this example)
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing or invalid.' });
    }
    const token = authHeader.split(' ')[1];
    // In a real app, you would validate the token (e.g., JWT verification)
    if (token) { // Simplified check
        req.user = { id: 'dummyUser' }; // Attach user info
        next();
    } else {
        res.status(403).json({ message: 'Invalid token.' });
    }
};

// Registration API
app.post('/evaluation-service/register', (req, res) => {
    const { email, name, mobileNo, githubUsername, rollNo, accessCode } = req.body;

    // Basic validation
    if (!email || !name || !mobileNo || !githubUsername || !rollNo || !accessCode) {
        return res.status(400).json({ message: 'All fields are required for registration.' });
    }

    // Check if user already exists
    if (users.some(user => user.email === email)) {
        return res.status(409).json({ message: 'User with this email already exists.' });
    }

    const clientID = `client-${Date.now()}`;
    const clientSecret = `secret-${Date.now()}`;

    const newUser = { email, name, mobileNo, githubUsername, rollNo, accessCode, clientID, clientSecret };
    users.push(newUser);

    console.log('New user registered:', newUser);
    res.status(200).json({
        email: newUser.email,
        name: newUser.name,
        rollNo: newUser.rollNo,
        accessCode: newUser.accessCode,
        clientID: newUser.clientID,
        clientSecret: newUser.clientSecret
    });
});

// Authentication API
app.post('/evaluation-service/auth', (req, res) => {
    const { email, name, rollNo, accessCode, clientID, clientSecret } = req.body;

    // Basic validation
    if (!email || !name || !rollNo || !accessCode || !clientID || !clientSecret) {
        return res.status(400).json({ message: 'All authentication fields are required.' });
    }

    const user = users.find(u =>
        u.email === email &&
        u.name === name &&
        u.rollNo === rollNo &&
        u.accessCode === accessCode &&
        u.clientID === clientID &&
        u.clientSecret === clientSecret
    );

    if (!user) {
        return res.status(401).json({ message: 'Invalid credentials.' });
    }

    // In a real application, you would generate a proper JWT token here.
    // For this example, we'll just return a dummy token.
    const dummyToken = `dummy_jwt_token_for_${user.email}_${Date.now()}`;
    const expiresIn = 3600; // 1 hour

    res.status(200).json({
        token_type: 'Bearer',
        access_token: dummyToken,
        expires_in: expiresIn
    });
});

// URL Shortening API
app.post('/shorten', verifyToken, (req, res) => {
    const { originalUrl, validityMinutes, customShortCode } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ message: 'Original URL is required.' });
    }

    let shortCode = customShortCode;
    if (customShortCode) {
        if (urls[customShortCode]) {
            return res.status(409).json({ message: 'Custom short code already exists.' });
        }
        // Basic validation for custom shortcode (alphanumeric, reasonable length)
        if (!/^[a-zA-Z0-9]{4,10}$/.test(customShortCode)) {
            return res.status(400).json({ message: 'Custom short code must be alphanumeric and between 4-10 characters long.' });
        }
    } else {
        shortCode = generateShortCode();
    }

    const expiry = validityMinutes ? new Date(Date.now() + validityMinutes * 60 * 1000) : new Date(Date.now() + 30 * 60 * 1000); // Default 30 mins
    const createdAt = new Date();

    urls[shortCode] = { originalUrl, expiry, clicks: [], createdAt };

    res.status(200).json({
        originalUrl,
        shortUrl: `http://localhost:${PORT}/${shortCode}`,
        expiry: expiry.toISOString(),
        shortCode,
    });
});

// Redirection API
app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;
    const urlEntry = urls[shortCode];

    if (!urlEntry) {
        return res.status(404).send('URL not found.');
    }

    if (urlEntry.expiry && new Date() > urlEntry.expiry) {
        delete urls[shortCode]; // Remove expired URL
        return res.status(410).send('URL expired.');
    }

    // Log click data
    urlEntry.clicks.push({
        timestamp: new Date(),
        source: req.headers.referer || 'direct',
        ip: req.ip, // Note: req.ip might not be accurate without proxy setup
    });

    res.redirect(urlEntry.originalUrl);
});

// Statistics API
app.get('/stats', verifyToken, (req, res) => {
    const allUrls = Object.keys(urls).map(shortCode => ({
        shortCode,
        originalUrl: urls[shortCode].originalUrl,
        shortUrl: `http://localhost:${PORT}/${shortCode}`,
        createdAt: urls[shortCode].createdAt.toISOString(),
        expiry: urls[shortCode].expiry ? urls[shortCode].expiry.toISOString() : 'never',
        totalClicks: urls[shortCode].clicks.length,
        detailedClicks: urls[shortCode].clicks,
    }));
    res.status(200).json(allUrls);
});

// Logging API
app.post('/evaluation-service/logs', verifyToken, (req, res) => {
    const { stack, level, package: pkg, message } = req.body;

    if (!stack || !level || !pkg || !message) {
        return res.status(400).json({ message: 'All log fields (stack, level, package, message) are required.' });
    }

    const newLog = { timestamp: new Date(), stack, level, package: pkg, message };
    logs.push(newLog);
    console.log('New log entry:', newLog);
    res.status(200).json({ logID: `log-${Date.now()}`, message: 'log created successfully' });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
