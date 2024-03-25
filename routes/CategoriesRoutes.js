const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Category = require('../models/Category');

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
//URL http://localhost:5001/categories/token
router.post('/token', async (req, res) => {
    const { name } = req.body; // Using `name` to identify the category
    if (!name) {
        return res.status(400).send('Name is required');
    }
    try {
        // Find the category by its name
        const category = await Category.findOne({ name: name }); 
        if (!category) {
            return res.status(404).send('Category not found');
        }
        const token = jwt.sign({ categoryName: name }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
// Get all categories
// URL http://localhost:5001/categories/
router.get('/', verifyToken, async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Get a single category by ID
// URL http://localhost:5001/categories/66014bd4ca4732ca9a74a7c3
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).send('Category not found');
        res.json(category);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Create a new category
// URL http://localhost:5001/categories/
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const newCategory = new Category({ name, description });

        await newCategory.save();
        res.status(201).send('Category created');
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Update a category
// URL http://localhost:5001/categories/66014bd4ca4732ca9a74a7c3
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );

        if (!updatedCategory) return res.status(404).send('Category not found');
        res.json(updatedCategory);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});


// Update encrypted name of a category      categories/:id/name
// URL http://localhost:5001/categories/66014bd4ca4732ca9a74a7c3/name
router.patch('/:id/name', verifyToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        
        if (!name) {
            return res.status(400).send('Name is required');
        }

        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).send('Category not found');
        }

        const hashedName = await bcrypt.hash(name, 10);

        category.name = hashedName;

        await category.save();

        res.json(category);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

// Delete a category// URL http://localhost:5001/categories/66014bd4ca4732ca9a74a7c3
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);
        if (!deletedCategory) return res.status(404).send('Category not found');
        res.send(`Category with ID ${req.params.id} was deleted`);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;