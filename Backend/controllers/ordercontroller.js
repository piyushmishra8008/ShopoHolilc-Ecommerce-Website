const order = require('../model/order');
const sendemail = require('../utils/sendmail');
//create order
const createorder = async (req, res) => {
    try {
        const { items, totalamount, address, paymentid } = req.body;
        if (!items || items.length === 0 || !totalamount || !address ) {
            return res.status(400).json({ message: 'No items in the order' });
        }
        else {
            const order1= new order({
                user: req.user._id,
                items,
                totalamount,
                address,
                paymentid
            });
            await order1.save();
            const message= `Your order with ID ${order1._id} has been created successfully. Total amount: ${totalamount}. Shipping to: ${address.street}, ${address.city}, ${address.country}.`;
            console.log(req.user);
console.log(req.user.email);
            await sendemail({
    from: process.env.EMAIL_USER,
    to: req.user.email,
    subject: 'Order Created',
    text: message
});
            res.status(201).json({ message: 'Order created successfully', order: order1 });
        }
    } catch (error) {
    console.error(error);

    res.status(500).json({
        message: 'Error creating order',
        error: error.message
    });
}
};

const getorders = async (req, res) => {
    try {
        const orders = await order.find({}).populate('user', 'name email ');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error });
    }
};
const myorders = async (req, res) => {
    try {
        const orders = await order.find({ user: req.user._id }).populate('items.product', 'name price');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching my orders', error });
    }
};
const updateorderstatus = async (req, res) => {
    try {
        const orderid = req.params.id;
        const { status } = req.body;
        const orderdata = await order.findById(orderid);
        if (!orderdata) {
            return res.status(404).json({ message: 'Order not found' });
        }
        orderdata.status = status;
        await orderdata.save();
        res.json({ message: 'Order status updated successfully', order: orderdata });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error });
    }
};

module.exports = {
    createorder,
    getorders,
    myorders,
    updateorderstatus
};