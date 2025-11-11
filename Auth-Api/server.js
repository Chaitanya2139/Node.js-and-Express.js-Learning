// Load environment variables from .env (if present) and ensure JWT secret is available
require('dotenv').config();

const express = require('express');
const userRouter = require('./router/userRouter');
const db = require('./db');

// Ensure a JWT secret is present at runtime. For development we fall back to a
// temporary secret but log a prominent warning. Do NOT use the fallback in
// production.
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
if (!process.env.JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET is not set. Using insecure fallback for development. Set JWT_SECRET in your environment or .env for production.');
}
// Make sure other modules reading process.env.JWT_SECRET see the value
process.env.JWT_SECRET = JWT_SECRET;

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const app = express();
const PORT = 4000;
app.use(express.json());
app.use(requestLogger);
app.use('/users', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});