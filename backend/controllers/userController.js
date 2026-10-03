const pool = require('../config/db');
const bcrypt = require('bcrypt');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id, first_name, last_name, email, role, created_at FROM users WHERE id = ?', [req.user.id]);
        
        if (users.length > 0) {
            res.json(users[0]);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while fetching profile' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [req.user.id]);
        
        if (users.length > 0) {
            const user = users[0];

            user.first_name = req.body.first_name || user.first_name;
            user.last_name = req.body.last_name || user.last_name;
            user.email = req.body.email || user.email;

            let query = 'UPDATE users SET first_name = ?, last_name = ?, email = ?';
            let params = [user.first_name, user.last_name, user.email];

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                query += ', password_hash = ?';
                params.push(hashedPassword);
            }

            query += ' WHERE id = ?';
            params.push(req.user.id);

            await pool.query(query, params);

            res.json({
                id: req.user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating profile' });
    }
};

module.exports = {
    getUserProfile,
    updateUserProfile
};
