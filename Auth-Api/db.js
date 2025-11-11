const mongoose = require('mongoose');


const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/itmDB';

mongoose.connect(MONGO_URI, {
    
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

const db = mongoose.connection;

db.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
});

module.exports = db;