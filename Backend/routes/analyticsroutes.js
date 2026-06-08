const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authmiddleware');
const { admin } = require('../middleware/adminmiddleware');
const { getadminanalytics } = require('../controllers/analyticscontroller');


router.get('/', protect,admin,getadminanalytics);
module.exports = router;