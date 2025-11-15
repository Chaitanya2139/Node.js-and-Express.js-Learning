const express=require('express');
const User=require('../models/userModel');  

const bcrypt=require('bcryptjs');

const router=express.Router();


router.post('/register', async (request, response) => {
    try {
        const { name, username, email, password } = request.body;

        // Basic validation
        if (!username || !email || !password) {
            return response.status(400).json({ message: 'username, email and password are required' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return response.status(400).json({ message: 'Username already exists' });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return response.status(400).json({ message: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            name,
            username,
            email,
            password: hashedPassword
        };
        const user = await User.create(newUser);
        // user.toJSON will hide password
        return response.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        response.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports=router;