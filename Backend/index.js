const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

const connectdb = require('./config/db');
const userroutes = require('./routes/authroutes');

app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: true,
  credentials: true
}));

connectdb();

app.use('/api/auth', userroutes);
app.use('/api/products', require('./routes/productroutes'));
app.use('/api/orders', require('./routes/orderroutes'));
app.use('/api/payments', require('./routes/paymentroutes'));
app.use('/api/analytics', require('./routes/analyticsroutes'));

app.get('/', (req, res) => {
  res.send('API WORKING');
});
app.get('/cors-test', (req, res) => {
  res.json({ message: 'new deployment active' });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});