const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}
router.use(requestLogger);

// GET /users - Get all users (excluding passwords)
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('GET /users error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /users/:id - Get a specific user by ID (excluding password)
router.get('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user id' });
        }
        
        const user = await User.findById(id).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(`GET /users/${req.params.id} error:`, error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ 
                error: 'Missing required fields: username, email, password' 
            });
        }

        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        
        const safeUser = newUser.toObject();
        delete safeUser.password;
        res.status(201).json(safeUser);
    } catch (error) {
        console.error('POST /register error:', error);
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                error: 'Missing required fields: username, password' 
            });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const safeUser = user.toObject();
        delete safeUser.password;
        res.status(200).json({ 
            message: 'Login successful', 
            user: safeUser 
        });
    } catch (error) {
        console.error('POST /login error:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;