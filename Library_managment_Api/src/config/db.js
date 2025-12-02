const mongoose=require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/libraryDB';

mongoose.connect(MONGO_URI);

const db=mongoose.connection;

db.on('connected',()=>{
    console.log('Database connected successfully...');
});

db.on('error',()=>{
    console.log('Database connection failed...');
});

module.exports=db;