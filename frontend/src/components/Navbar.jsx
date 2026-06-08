import React from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { useSelector } from "react-redux";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const navigate=useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <nav className="navbar">   
        <div className="navbar-logo">
            <Link to="/">
            <img src="/ShopNestLogo.png" alt="Logo" />
            ShopoHolic</Link>
        </div>
        <ul className="navbar-links">
            <li><Link to="/shop">Shop</Link></li>
            <li><Link to="/cart">Cart ({cartItems.length})</Link></li>
            {user ? (
              <>
                <li><Link to="/profile">Welcome, {user.name}</Link></li>
                {user?.role === 'admin' && (
  <li>
    <Link to="/admin">Admin Dashboard</Link>
  </li>
)}
                <li><button onClick={handleLogout} className="btn-logout">
                  Logout
                </button></li>
              </>
            ) : (
                <li><Link to="/login">Login</Link></li>
            )}
        </ul>   
    </nav>
  );
}
export default Navbar;