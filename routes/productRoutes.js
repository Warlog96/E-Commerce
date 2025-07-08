const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/authMiddleware');

router.get('/', async(req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/', protect, async(req, res) => {
    const { name, description, price, image } = req.body;
    if (!name || !description || !price) {
        return res.status(400).json({ error: 'Please include all required fields' });
    }
    try {
        const product = await Product.create({
            name,
            description,
            price,
            image: image || 'https://via.placeholder.com/150',
        });
        res.status(201).json(product);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;