const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        // Validation
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user exists
        const [users] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Determine role (make first user admin for testing, others customer)
        const [totalUsers] = await pool.query('SELECT COUNT(*) as count FROM users');
        const role = totalUsers[0].count === 0 ? 'admin' : 'customer';

        // Insert user
        const [result] = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, role]
        );

        res.status(201).json({
            id: result.insertId,
            first_name,
            last_name,
            email,
            role,
            token: generateToken(result.insertId, role),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check for user email
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (user && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { registerUser, loginUser };
