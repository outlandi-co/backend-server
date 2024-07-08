const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Route for user sign-up
router.post('/signup', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Check if all required fields are present
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password' });
    }

    // Check if user with the same email exists
    let existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash the password before saving it
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return res.status(500).json({ message: 'Error creating user' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

// Route for user sign-in
router.post('/signin', async (req, res, next) => {
  const { username, password } = req.body;

  try {
    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({ message: 'Please provide username and password' });
    }

    // Check if user exists
    let user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create and send JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      result: user,
      token
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

module.exports = router;
