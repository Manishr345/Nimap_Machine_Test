const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
    try {
        const [procedureResult] = await pool.query('call getAllCategories()');
        const categories = procedureResult[0];
        res.json({ data: categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { categoryName } = req.body;
        await pool.query('call insertCategory(?)', [categoryName]);
        res.status(201).json({ message: "Category created successfully" });
    } catch (error) {
        console.error("Error inserting category:", error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const { categoryName } = req.body;
        await pool.query('call updateCategory(?, ?)', [categoryId, categoryName]);
        res.json({ message: "Category updated successfully" });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        await pool.query('call deleteCategory(?)', [categoryId]);
        res.json({ message: "Category and associated products deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

module.exports = router;