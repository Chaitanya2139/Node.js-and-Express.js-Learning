require('dotenv').config();

const express = require('express');
const hotelRouter = require('./router/hotelRouter');
const authRouter = require('./router/authRouter');
const db = require('./db');

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(requestLogger);

app.use('/', hotelRouter);  
app.use('/', authRouter);   

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});