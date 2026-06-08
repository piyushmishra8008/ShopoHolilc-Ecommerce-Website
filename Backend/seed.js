const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const User = require('./model/user');
const Product = require('./model/product');
const Order = require('./model/order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce';

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin1234',
    role: 'admin',
    verified: true,
  },
  {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'Jane1234',
    role: 'user',
    verified: true,
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'John1234',
    role: 'user',
    verified: false,
  },
];

const products = [
  {
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with noise cancellation and long battery life.',
    price: 49.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46',
    stock: 120,
    ratings: 4.5,
    numReviews: 25,
  },
  {
    name: 'Running Sneakers',
    description: 'Lightweight running sneakers with breathable mesh and cushioned sole.',
    price: 79.99,
    category: 'Footwear',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    stock: 80,
    ratings: 4.7,
    numReviews: 48,
  },
  {
    name: 'Coffee Maker',
    description: '12-cup drip coffee maker with timer and glass carafe.',
    price: 39.99,
    category: 'Home Appliances',
    imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    stock: 54,
    ratings: 4.2,
    numReviews: 13,
  },
  {
    name: 'Yoga Mat',
    description: 'Non-slip yoga mat with extra cushioning.',
    price: 24.99,
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
    stock: 150,
    ratings: 4.8,
    numReviews: 89,
  },
  {
    name: 'Gaming Laptop',
    description: 'High-performance gaming laptop with RTX graphics.',
    price: 1299.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853',
    stock: 25,
    ratings: 4.9,
    numReviews: 142,
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches.',
    price: 89.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae',
    stock: 70,
    ratings: 4.6,
    numReviews: 76,
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracking and heart-rate monitoring smartwatch.',
    price: 149.99,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
    stock: 60,
    ratings: 4.4,
    numReviews: 94,
  },
  {
    name: 'Bluetooth Speaker',
    description: 'Portable waterproof Bluetooth speaker.',
    price: 59.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1589003077984-894e133dabab',
    stock: 95,
    ratings: 4.5,
    numReviews: 55,
  },
  {
    name: 'Office Chair',
    description: 'Ergonomic office chair with lumbar support.',
    price: 199.99,
    category: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455',
    stock: 35,
    ratings: 4.7,
    numReviews: 67,
  },
  {
    name: 'Study Desk',
    description: 'Wooden study desk with storage shelves.',
    price: 249.99,
    category: 'Furniture',
    imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    stock: 22,
    ratings: 4.3,
    numReviews: 31,
  },
  {
    name: 'Backpack',
    description: 'Water-resistant laptop backpack.',
    price: 34.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62',
    stock: 140,
    ratings: 4.5,
    numReviews: 88,
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with adjustable DPI.',
    price: 19.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    stock: 180,
    ratings: 4.4,
    numReviews: 63,
  },
  {
    name: 'Protein Powder',
    description: 'Whey protein for muscle recovery and growth.',
    price: 44.99,
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b',
    stock: 90,
    ratings: 4.6,
    numReviews: 120,
  },
  {
    name: 'Dumbbell Set',
    description: 'Adjustable dumbbell set for home workouts.',
    price: 89.99,
    category: 'Fitness',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438',
    stock: 40,
    ratings: 4.8,
    numReviews: 102,
  },
  {
    name: 'LED Monitor',
    description: '27-inch Full HD monitor with slim bezels.',
    price: 179.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
    stock: 45,
    ratings: 4.7,
    numReviews: 58,
  }
];

const orders = [
  {
    address: {
      fullname: 'Jane Doe',
      street: '123 Main St',
      city: 'Pune',
      postalCode: '411001',
      country: 'India',
    },
    paymentid: 'pay_1234567890',
    status: 'Pending',
  },
];

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    const hashedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      })
    );

    const createdUsers = await User.insertMany(hashedUsers);
    const createdProducts = await Product.insertMany(products);

    const order = {
      user: createdUsers[1]._id,
      items: [
        {
          product: createdProducts[0]._id,
          quantity: 1,
          price: createdProducts[0].price,
        },
        {
          product: createdProducts[2]._id,
          quantity: 2,
          price: createdProducts[2].price,
        },
      ],
      totalamount:
        createdProducts[0].price + createdProducts[2].price * 2,
      address: orders[0].address,
      paymentid: orders[0].paymentid,
      status: orders[0].status,
    };

    await Order.create(order);

    console.log('Seed data created successfully');
    console.log(`Users: ${createdUsers.length}, Products: ${createdProducts.length}, Orders: 1`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connectDB().then(seedData);