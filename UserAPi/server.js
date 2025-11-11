const express = require('express');
const userRouter = require('./router/userRouter');

const app = express();
app.use(express.json());

app.use('/users', userRouter);

app.listen(4000, () => {    
    console.log('Server is running on port 4000');
});