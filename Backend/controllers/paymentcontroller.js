const Razorpay = require('razorpay');

const crypto = require('crypto');
dotenv = require('dotenv');
dotenv.config();

const createdorder = async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
        const options = {
            amount: req.body.amount * 100, // amount in the smallest currency unit
            currency: 'INR',
            receipt: `receipt_${Math.random() * 1000}`
        };
        const order2 = await instance.orders.create(options);
        res.json(order2);
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

const verifypayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
        const shasum = crypto.createHash('sha256')
        shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
        const digest = shasum.digest('hex');
        if (digest === razorpay_signature) {
            res.json({ message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment', error: error.message });
    }
};

module.exports = {
    createdorder,
    verifypayment
};