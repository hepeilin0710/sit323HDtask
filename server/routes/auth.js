const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Allow duplicate usernames
        const user = await User.create({ username, password: hashedPassword });
        res.status(201).json({ message: 'Registration successful', user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }
       
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        // Check 
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect password' });
        }
        req.session.userId = user._id;
        req.session.username = user.username;
        res.json({ message: 'Login successful', user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Logout route
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Get current user info
router.get('/me', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ message: 'Not logged in' });
    }
    res.json({
        id: req.session.userId,
        username: req.session.username
    });
});

// Update user info 
router.post('/update', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ message: 'Not logged in' });
        }
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }
        
        const user = await User.findByIdAndUpdate(
            req.session.userId,
            { username },
            { new: true }
        );
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        req.session.username = username;
        res.json({ message: 'Update successful', user: { id: user._id, username: user.username } });
    } catch (error) {
        console.error('Update user info failed:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router; 