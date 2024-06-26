const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Get all users
// URL http://localhost:5001/
router.get('/', async (req, res) => {
    try {
        const allUsers = await User.find().select('-password'); 
        res.json(allUsers);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Get a single user by ID
// URL http://localhost:5001/66014bd4ca4732ca9a74a7b2
router.get('/:id', async (req, res) => {
    try {
        const givenID = req.params.id;
        const wantedUser = await User.findById(givenID).select('-password'); 
        if (!wantedUser) return res.status(404).send('User not found');
        res.json(wantedUser);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Create a new user
// URL http://localhost:5001/
router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ email: email });
        if (userExists) {
            return res.status(400).send('Email already in use');
        }
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            email,
            password: hashedPass,
        });
        if (!password) {
            return res.status(400).send('Password is required');
        }
        await newUser.save();
        res.status(200).send('User created');
    } catch (err) {
        if (err.username === 'ValidationError') {
            return res.status(400).send('Validation Error: ' + err.message);
        }
        console.error("Error detail:", err);
        res.status(500).send('Server error');
    }
});

// User login
// URL http://localhost:5001/login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) return res.status(400).send('Unknown email');

        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if (isValidPassword) {
            const token = jwt.sign({ userId: user._id, name: user.name }, 'your_secret_key', { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).send('Not allowed');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/whoami', (req, res) => {
    const token = req.body.token;
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        res.json(decoded.userId); 
    } catch (err) {
        res.status(401).send('Invalid token');
    }
});


// Update user
// URL http://localhost:5001/users/66014bd4ca4732ca9a74a7b2
router.put('/:id', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const hashedPass = await bcrypt.hash(password, 10);

        const updatedUser = await User.findByIdAndUpdate(req.params.id, {
            username,
            email,
            password: hashedPass,
        }, { new: true }).select('-password');
        res.json(updatedUser);
        if (!updatedUser) return res.status(404).send('User not found');
        res.json(updatedUser);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
//Update Email of user by id .
// URL http://localhost:5001/users/66014bd4ca4732ca9a74a7b2/email

router.patch('/:id/email', async (req, res) => {
    try {
        const { id } = req.params;
        const { email } = req.body;

        if (!email) {
            return res.status(400).send('Email is required');
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        user.email = email;
        if (req.body.password) {
            const hashedPass = await bcrypt.hash(req.body.password, 10);
            user.password = hashedPass;
        }
        await user.save();

        res.json(user);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Delete a user
// URL http://localhost:5001/66014bd4ca4732ca9a74a7b2
router.delete('/:id', async (req, res) => {
    try {
        const givenID = req.params.id;
        const deletedUser = await User.findByIdAndDelete(givenID);
        if (!deletedUser) return res.status(404).send('User not found');
        res.send(`User with ID ${givenID} was deleted`);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
module.exports = router;