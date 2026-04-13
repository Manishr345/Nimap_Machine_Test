const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page);
        const pageSize = parseInt(req.query.pageSize);
        
        const offset = (page - 1) * pageSize;

        const [countResult] = await pool.query('select count(*) as total from products');
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / pageSize);

        const [procedureResult] = await pool.query('call getAllProducts(?, ?)', [pageSize, offset]);
        
        const products = procedureResult[0]; 

        res.json({
            data: products,
            pagination: {
                page,
                pageSize,
                total,
                totalPages
            }
        });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: 'Database error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { productName, categoryId } = req.body;
        await pool.query('call insertProduct(?, ?)', [productName, categoryId]);
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { productName, categoryId } = req.body;
        await pool.query('call updateProduct(?, ?, ?)', [productId, productName, categoryId]);
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await pool.query('call deleteProduct(?)', [productId]);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;