const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'username, email and password required' });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(400).json({ message: 'username or email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    return res.status(201).json({ message: 'User registered', user });
  } catch (err) {
    console.error(err && err.stack ? err.stack : err);
    return res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', (req, res, next) => {
  
  const passportAuthenticate = require('passport').authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err && err.stack ? err.stack : err);
      return res.status(500).json({ message: 'Server error' });
    }
    if (!user) return res.status(400).json({ message: info?.message || 'Invalid credentials' });

    // Log the user in (establish session)
    req.logIn(user, (err) => {
      if (err) {
        console.error(err && err.stack ? err.stack : err);
        return res.status(500).json({ message: 'Server error' });
      }
      // Return user info without password
      const userObj = user.toJSON ? user.toJSON() : { id: user._id, username: user.username };
      return res.json({ message: 'Login successful', user: userObj });
    });
  });
  passportAuthenticate(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logged out' });
  });
});

module.exports = router;
