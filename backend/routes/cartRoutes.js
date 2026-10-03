const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeCartItem } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getCart)
    .post(protect, addToCart);

router.route('/:id')
    .put(protect, updateCartItem)
    .delete(protect, removeCartItem);

module.exports = router;
