const pool = require('../config/db');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Insert Order
        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, total_amount, shipping_amount, tax_amount, final_amount, shipping_address, payment_method) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [req.user.id, itemsPrice, shippingPrice, taxPrice, totalPrice, JSON.stringify(shippingAddress), paymentMethod]
        );
        const orderId = orderResult.insertId;

        // 2. Insert Order Items
        for (const item of orderItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
                [orderId, item.product_id, item.quantity, item.price]
            );
            
            // 3. Reduce stock
            await connection.query(
                `UPDATE products SET stock = stock - ? WHERE id = ?`,
                [item.quantity, item.product_id]
            );
        }

        // 4. Clear cart (optional, assuming items ordered from cart are passed)
        // Find cart
        const [carts] = await connection.query('SELECT id FROM cart WHERE user_id = ?', [req.user.id]);
        if(carts.length > 0){
             await connection.query('DELETE FROM cart_items WHERE cart_id = ?', [carts[0].id]);
        }

        await connection.commit();
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Server Error during order creation' });
    } finally {
        if (connection) connection.release();
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }
        const order = orders[0];

        // Check if user is admin or the order belongs to them
        if (order.user_id !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        // Fetch order items
        const [items] = await pool.query(`
            SELECT oi.*, p.name, p.image_url 
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            WHERE oi.order_id = ?
        `, [order.id]);

        order.items = items;
        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        
        const [result] = await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ message: 'Order status updated' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { createOrder, getOrderById, getMyOrders, updateOrderStatus };
