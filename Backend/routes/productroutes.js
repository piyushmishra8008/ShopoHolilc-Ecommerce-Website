const express= require('express');
const router= express.Router();
const {protect} = require('../middleware/authmiddleware');
const {admin} = require('../middleware/adminmiddleware');
const {getproducts, createproduct, getproductbyid, updateproduct, deleteproduct} = require('../controllers/productcontroller');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
//all product routes
router.route('/').get(getproducts).post(protect,admin,upload.single('image'),createproduct);
//specific product routes
router.route('/:id').get(getproductbyid).put(protect,admin,upload.single('image'),updateproduct).delete(protect,admin,deleteproduct);
module.exports=router;