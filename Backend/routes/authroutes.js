const express= require('express');
const router= express.Router();
const {registeruser,loginuser,getuser,verifyotp} = require('../controllers/authcontroller');
const {protect} = require('../middleware/authmiddleware');
const {admin} = require('../middleware/adminmiddleware');


router.post('/register', registeruser);
router.post('/login', loginuser);
router.get("/users", protect,admin,getuser);
router.post('/verify-otp', verifyotp);


module.exports= router;
