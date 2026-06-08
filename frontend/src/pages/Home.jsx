import React from 'react';
import { API_URL } from '../config';

import '../styles/home.css';
import ProductCard from '../components/Productcard';

import { useState, useEffect } from 'react';

const Home = () => {
  const [products, SetProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`);
        const data = await response.json();
       
        SetProducts(data.slice(0, 15)); // Display only the first 4 products on the homepage
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);
  return (
   <div className="home-container">
      <div className="hero-banner">
        <h1>Welcome to ShopNest</h1>
        <p>Discover the best products at unbeatable prices.</p>
      </div>
      <h2>Featured Products</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );

};

export default Home;