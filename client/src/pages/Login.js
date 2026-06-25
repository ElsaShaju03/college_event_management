import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import axios from 'axios';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      
      // Save Token and User Info
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      
      alert("Login Successful!");

      // --- ROLE-BASED REDIRECTION ---
      if (res.data.user.role === 'admin') {
        navigate("/admin-dashboard"); // Navigate to Admin UI
      } else {
        navigate("/"); // Navigate to Student UI (Home)
      }

    } catch (err) {
      alert(err.response?.data?.msg || "Login Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login to manage your events</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail size={20} />
            <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
          </div>
          <div className="input-group">
            <Lock size={20} />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          </div>
          <button type="submit" className="auth-btn">Login</button>
        </form>
        <p className="auth-footer">Don't have an account? <Link to="/register">Register Here</Link></p>
      </div>
    </div>
  );
};

export default Login;