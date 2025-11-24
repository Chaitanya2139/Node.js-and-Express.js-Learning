const express = require('express');
const path = require('path');
const cors = require('cors');
const employeeRouter = require('./router/employeeRouter');
const db = require('./db');

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const app = express();
const PORT = 4000;

app.use(express.json());
// Allow cross-origin requests from the browser. Use the cors middleware correctly.
app.use(cors());
app.use(requestLogger);

// Development Content Security Policy: allow same-origin resources and
// connect-src to localhost so devtools and local APIs can be contacted.
// In production you should tighten this policy.
app.use((req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        // stricter policy for production (example)
        res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:");
    } else {
        // Development-friendly CSP: allow self and localhost connections (http/ws)
        const devCsp = "default-src 'self'; connect-src 'self' http://localhost:4000 ws://localhost:4000; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'";
        res.setHeader('Content-Security-Policy', devCsp);
    }
    next();
});

// Serve static files from `public` directory using absolute path.
app.use(express.static(path.join(__dirname, 'public')));

// Ensure GET / returns the index file (explicit route avoids 404 when
// static lookup fails due to cwd/path issues).
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

// Mount API routes under /api/employees so frontend calls to /api/employees
// match the router's internal routes (router defines '/' -> list/create)
app.use('/api/employees', employeeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});