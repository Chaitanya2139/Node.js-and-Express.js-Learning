const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.post('/register', async (request, response) => {
    const { email, password } = request.body;
    try {
        const {name, username, email, password } = request.body;

        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return response.status(400).send({ error: 'Username already exists' });
        }

        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return response.status(400).send({ error: 'Email already registered' });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = { name, username, email, password: hashPassword };
        const user = await User.create(newUser);
        response.status(201).send({ message: 'User registered successfully', user });
    
    } catch (err) {
        response.status(500).send({ error: 'Internal Server Error' });
    }
});

module.exports = router;