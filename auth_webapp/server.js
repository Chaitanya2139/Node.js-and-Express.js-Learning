const express = require('express');
require('dotenv').config();
const path = require('path');
const fs = require('fs');

// Ensure DB connection is established
require('./config/db');
const UserRouter = require('./router/user_router');

const app = express();

app.use(express.json());
// Choose static folder: prefer React build/ if present, otherwise public/
const buildDir = path.join(__dirname, 'build');
const publicDir = path.join(__dirname, 'public');
const staticDir = fs.existsSync(buildDir) ? buildDir : publicDir;

// Development-friendly CSP to allow DevTools fetches and local websocket
// connections. Remove or tighten for production.
app.use((req, res, next) => {
    const csp = [
        "default-src 'self'",
        "connect-src 'self' http://localhost:4000 ws://localhost:4000 wss:",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data:",
    ].join('; ');
    res.setHeader('Content-Security-Policy', csp);
    if (process.env.NODE_ENV !== 'production') {
        res.setHeader('Content-Security-Policy-Report-Only', csp);
    }
    next();
});

app.use(express.static(staticDir));

// Ensure GET / returns the index file from the chosen static directory.
app.get('/', (req, res) => {
    const indexPath = path.join(staticDir, 'index.html');
    const rootIndex = path.join(__dirname, 'index.html');
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    if (fs.existsSync(rootIndex)) return res.sendFile(rootIndex);
    return res.status(404).send('index.html not found');
});

// Debug endpoint: return the CSP header value that the server sets and
// request headers so you can inspect what's actually being returned to the
// browser. Open http://localhost:4000/__csp__ in your browser or curl it.
app.get('/__csp__', (req, res) => {
    const serverCsp = res.getHeader('Content-Security-Policy') || null;
    res.json({
        serverCsp,
        requestHeaders: req.headers,
    });
});
app.use('/api/users', UserRouter);

app.use('/users' , UserRouter);

// For client-side routing: serve index.html for any non-API GET request
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ error: 'API route not found' });
    const indexPath = path.join(staticDir, 'index.html');
    if (fs.existsSync(indexPath)) return res.sendFile(indexPath);
    return res.status(404).send('index.html not found');
});

app.listen(4000, () => {    
    console.log('Server is running on port 4000 i.e http://localhost:4000' );
});