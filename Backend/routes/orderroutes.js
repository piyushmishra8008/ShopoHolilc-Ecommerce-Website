const express= require('express');
const router= express.Router();
const {protect} = require('../middleware/authmiddleware');
const {admin} = require('../middleware/adminmiddleware');


const {createorder, getorders, myorders, updateorderstatus} = require('../controllers/ordercontroller');
//all order routes
router.route('/').post(protect,createorder).get(protect,admin,getorders);
//get orders
router.route('/myorders').get(protect,myorders);
//specific order routes
router.route('/:id/status').put(protect,admin,updateorderstatus);
module.exports=router;