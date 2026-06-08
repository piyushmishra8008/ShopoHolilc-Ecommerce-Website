const express = require('express');
const router = express.Router();
const { createdorder, verifypayment } = require('../controllers/paymentcontroller');
const { protect } = require('../middleware/authmiddleware');

router.post('/order', protect, createdorder);
router.get('/verify', protect, verifypayment);

module.exports = router;