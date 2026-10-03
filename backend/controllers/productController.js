const pool = require('../config/db');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.pageNumber) || 1;
        const keyword = req.query.keyword ? `%${req.query.keyword}%` : '%';
        const category = req.query.category || '%';

        let queryStr = `
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.name LIKE ? 
        `;
        let countQueryStr = `SELECT COUNT(*) as count FROM products WHERE name LIKE ?`;
        let queryParams = [keyword];
        
        if (category !== '%') {
            queryStr += ` AND c.slug = ?`;
            countQueryStr += ` AND category_id = (SELECT id FROM categories WHERE slug = ?)`;
            queryParams.push(category);
        }

        queryStr += ` LIMIT ? OFFSET ?`;
        
        const [countResult] = await pool.query(countQueryStr, queryParams.length === 2 ? [keyword, category] : [keyword]);
        const count = countResult[0].count;

        queryParams.push(pageSize, pageSize * (page - 1));

        const [products] = await pool.query(queryStr, queryParams);

        res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const [products] = await pool.query(`
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id
            WHERE p.id = ?
        `, [req.params.id]);

        if (products.length > 0) {
            res.json(products[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    try {
        const { name, slug, description, category_id, brand, price, stock, is_featured } = req.body;

        const [result] = await pool.query(
            `INSERT INTO products (name, slug, description, category_id, brand, price, stock, is_featured) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, slug, description, category_id, brand, price, stock, is_featured || false]
        );

        res.status(201).json({ message: 'Product created', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProducts, getProductById, createProduct };
