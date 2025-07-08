const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async(req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const user = await User.create({ username, email, password });
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email
        });
    } catch (error) {
        res.status(400).json({ error: 'User registration failed' });
    }
});

// Login
router.post('/login', async(req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const token = jwt.sign({ userId: user._id },
            process.env.JWT_SECRET, { expiresIn: '30d' }
        );

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

module.exports = router;