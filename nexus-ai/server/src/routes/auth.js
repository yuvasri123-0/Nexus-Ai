const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const auth = require('../middleware/auth');

// Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: 'User already exists' });
        }

        user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || 'nexus_ai_secret_key_2026', { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET || 'nexus_ai_secret_key_2026', { expiresIn: '7d' });
        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get User Profile
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update Profile
router.put('/profile', auth, async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findById(req.user.id);
        
        if (name) user.name = name;
        if (password) user.password = password; // Pre-save hook will hash it

        await user.save();
        res.json({ message: 'Profile updated successfully', user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
