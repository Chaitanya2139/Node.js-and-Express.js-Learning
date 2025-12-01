const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://grandtable68_db_user:elevatecoders@cluster0.udvgvoe.mongodb.net/?appName=Cluster0');

const db=mongoose.connection;

db.on('connected',()=>{
    console.log('Database connected successfully...');
});

db.on('error',()=>{
    console.log('Database connection failed...');
});

module.exports=db;