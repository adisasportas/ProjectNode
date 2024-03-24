const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Task = require('../models/Task');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('A token is required for authentication');
    try {
        const decoded = jwt.verify(token, 'your_secret_key');
        req.user = decoded;
    } catch (err) {
        return res.status(401).send('Invalid Token');
    }
    return next();
};

router.post('/token', (req, res) => {
    const { title } = req.body; 
    if (!title) {
        return res.status(400).send('Title is required');
    }

    try {
        const token = jwt.sign({ title: title }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
// Get all tasks
router.get('/', verifyToken, async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Get a single task by ID
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send('Task not found');
        res.json(task);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Create a new task
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const newTask = new Task({
            title,
            description,
            status,
            dueDate,
        });

        await newTask.save();
        res.status(201).send('Task created');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Update a task
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { title, description, status, dueDate } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            { title, description, status, dueDate },
            { new: true }
        );

        if (!updatedTask) return res.status(404).send('Task not found');
        res.json(updatedTask);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Update title of a task

router.patch('/:id/title', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;

        if (!title) {
            return res.status(400).send('Title is required');
        }

        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send('Task not found');
        }

        task.title = title;

        await task.save();

        res.json(task);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Delete a task
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) return res.status(404).send('Task not found');
        res.send(`Task with ID ${req.params.id} was deleted`);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
router.get('/tasks', verifyToken, async (req, res) => {
    const { status, dueDate } = req.query;
    let filter = {};

    if (status) {
        filter.status = { $regex: new RegExp('^' + status + '$', 'i') }; // Case-insensitive match
    }

    if (dueDate) {
        const date = new Date(dueDate);
        date.setHours(0, 0, 0, 0);
        const nextDay = new Date(date);
        nextDay.setDate(date.getDate() + 1);

        filter.dueDate = { $gte: date, $lt: nextDay }; // Tasks within the specified day
    }

    try {
        const tasks = await Task.find(filter);
        res.json(tasks);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;