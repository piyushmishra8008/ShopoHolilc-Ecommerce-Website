import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import  AuthContext  from '../context/AuthContext';
import { clearCart } from '../redux/cartslice';
import { API_URL } from '../config';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullname: '', street: '', city: '', postalCode: '', country: ''
  });

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  

  const bypassPayment = async () => {
    console.log("Cart Items:", cartItems);
  try {
    console.log("BYPASS STARTED");

    const saveOrderRes = await fetch(`${API_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems.map(item => ({
  product: item.productId,
  quantity: item.qty,
  price: item.price
})),
        totalamount: totalPrice,
        address,
        paymentid: 'bypass_txn_' + Date.now()
      })
    });

    console.log("Response Status:", saveOrderRes.status);

    const data = await saveOrderRes.json();
    console.log("Response Data:", data);

    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
    } else {
      alert(data.message || "Order creation failed");
    }
  } catch (error) {
    console.error("Bypass Error:", error);
  }
};

 const handleSubmit = (e) => {
  e.preventDefault();

  console.log("PAY NOW CLICKED");

  if (!user) {
    alert("Please login first");
    return;
  }

  bypassPayment();
};
  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullname} onChange={(e) => setAddress({...address, fullname: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />
          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>
            <button type="submit" className="btn">Pay Now</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;