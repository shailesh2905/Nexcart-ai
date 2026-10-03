const pool = require('../config/db');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categories');
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        
        const [result] = await pool.query(
            'INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)',
            [name, slug, description]
        );

        res.status(201).json({ message: 'Category created', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        const { name, slug, description } = req.body;
        
        const [result] = await pool.query(
            'UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?',
            [name, slug, description, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.json({ message: 'Category deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
