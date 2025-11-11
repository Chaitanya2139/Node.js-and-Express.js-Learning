const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mongoose = require('mongoose');
// Use bcryptjs (pure JS) to avoid native build issues and match package.json
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const requestLogger = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
}
router.use(requestLogger);

// Public/static routes first: profile route reads token and returns current user.
// Place this before the param routes so `/profile` doesn't get treated as `/:id`.
router.get('/profile', async (req, res) => {
    try {
        // Accept Authorization: Bearer <token> or a custom token header
        const token = req.headers.authorization?.split(' ')[1] || req.headers.token;
        if (!token) return res.status(401).json({ error: 'Missing token' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json({ user });
    } catch (err) {
        console.error('GET /users/profile error:', err);
        res.status(401).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        // Do not return passwords
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error('GET /users error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
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
        const { name, username, email, password } = req.body;

        // Basic payload validation to give clearer feedback to clients.
        if (!name || !username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields: name, username, email, password' });
        }
        // Check for existing username or email to avoid duplicate-key errors
        const existing = await User.findOne({ $or: [{ username }, { email }] });
        if (existing) {
            return res.status(409).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();
        const safeUser = newUser.toObject();
        delete safeUser.password;
        res.status(201).json(safeUser);
    } catch (error) {
        console.error('POST /users error:', error);
        // If it's a Mongoose validation or duplicate key error, surface that to the client.
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic payload validation to give clearer feedback to clients.
        if (!username || !password) {
            return res.status(400).json({ error: 'Missing required fields: username, password' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const safeUser = user.toObject();
        delete safeUser.password;
        res.status(200).json({ message: 'Login successful', user: safeUser, token });
    } catch (error) {
        console.error('POST /users/login error:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/verify', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('POST /users/login error:', error);
        res.status(500).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user id' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).select('-password');
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error(`PUT /users/${req.params.id} error:`, error);
        // If it's a Mongoose validation or duplicate key error, surface that to the client.
        if (error.name === 'ValidationError' || error.code === 11000) {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid user id' });
        }
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(`DELETE /users/${req.params.id} error:`, error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;