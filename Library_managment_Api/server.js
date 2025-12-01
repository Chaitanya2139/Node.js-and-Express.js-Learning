const express=require('express');
require('dotenv').config();
const bookRouter=require('../src/routes/bookRouter');
const issueBookRouter=require('./src/routes/issueBookRouter');

const app=express();

app.get('/',(request,response)=>{
    response.json('Welcome To Library Management API');
});

app.get('/health',(request,response)=>{
    response.status(200).json({
        status:"OK",
        message:"Server is running successfully"
    })
});

const requestLogger=(request,response,next)=>{
    console.log(request);
    console.log(`${request.url} ${request.path} ${new Date().toISOString()}`);
    next();
};

app.use(express.json());
app.use(requestLogger);
app.use('/books/',bookRouter);
app.use('/issue-books/',issueBookRouter);

const PORT=process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log('Server is running on port 4000');
});