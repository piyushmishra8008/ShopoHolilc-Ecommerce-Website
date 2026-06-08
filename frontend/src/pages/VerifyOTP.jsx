import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { API_URL } from '../config';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const { login } = useContext(AuthContext);

  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email;

  const handleVerify = async (e) => {
    e.preventDefault();

    const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        otp
      })
    });

    const data = await res.json();

    if (res.ok) {
      login(data);
      navigate('/');
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleVerify} className="auth-form">
        <h2>Verify OTP</h2>

        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />

        <button type="submit" className="btn">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default VerifyOTP;