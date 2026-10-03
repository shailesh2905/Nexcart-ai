const express = require('express');
const router = express.Router();
const { getPriceComparisons } = require('../controllers/compareController');

router.route('/').get(getPriceComparisons);

module.exports = router;
