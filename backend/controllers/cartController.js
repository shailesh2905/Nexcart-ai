const pool = require('../config/db');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        // Find or create cart for user
        let [carts] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [req.user.id]);
        let cartId;

        if (carts.length === 0) {
            const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
            cartId = result.insertId;
        } else {
            cartId = carts[0].id;
        }

        // Get cart items with product details
        const [items] = await pool.query(`
            SELECT ci.id as cart_item_id, ci.quantity, p.* 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.cart_id = ?
        `, [cartId]);

        res.json({ cart_id: cartId, items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { product_id, quantity } = req.body;

        // Ensure cart exists
        let [carts] = await pool.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
        let cartId;
        if (carts.length === 0) {
            const [result] = await pool.query('INSERT INTO cart (user_id) VALUES (?)', [req.user.id]);
            cartId = result.insertId;
        } else {
            cartId = carts[0].id;
        }

        // Check if item already in cart
        const [existingItems] = await pool.query('SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?', [cartId, product_id]);

        if (existingItems.length > 0) {
            // Update quantity
            await pool.query('UPDATE cart_items SET quantity = quantity + ? WHERE id = ?', [quantity || 1, existingItems[0].id]);
        } else {
            // Insert new item
            await pool.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', [cartId, product_id, quantity || 1]);
        }

        res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:id
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { quantity } = req.body;
        
        const [result] = await pool.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Cart item updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeCartItem = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM cart_items WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getCart, addToCart, updateCartItem, removeCartItem };
