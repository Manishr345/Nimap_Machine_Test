const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'nimap'
});

app.get('/api/products', async (req, res) => {
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

app.post('/api/products', async (req, res) => {
    try {
        const { productName, categoryId } = req.body;
        await pool.query('call insertProduct(?, ?)', [productName, categoryId]);
        res.status(201).json({ message: "Product created successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const { productName, categoryId } = req.body;
        await pool.query('call updateProduct(?, ?, ?)', [productId, productName, categoryId]);
        res.json({ message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        await pool.query('call deleteProduct(?)', [productId]);
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log(`Server running on port ${5000}`));