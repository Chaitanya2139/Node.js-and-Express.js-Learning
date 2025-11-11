const express = require('express');
const employeeRouter = require('./router/employeeRouter');
const db = require('./db');
const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(requestLogger);
app.use('/employees', employeeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});