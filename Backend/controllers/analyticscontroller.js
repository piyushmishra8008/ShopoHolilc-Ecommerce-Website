const order= require('../model/order');
const user = require('../model/user');
const product = require('../model/product');
const getadminanalytics = async (req, res) => {
    try {
        const totalorders = await order.countDocuments({role:'user'});  
        const totalusers = await user.countDocuments({});
        const totalproducts = await product.countDocuments({});
        const orders = await order.find({});
        const totalrevenueData = await order.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: '$totalamount' } } }
        ]);
        const totalrevenue = orders.reduce((acc, order) => acc + order.totalamount, 0);
        res.json({ totalorders, totalusers, totalproducts, totalrevenue });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching analytics data', error: error.message });
    }   
};

module.exports = {
    getadminanalytics
};