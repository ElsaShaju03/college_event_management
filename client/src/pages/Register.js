import React, { useState } from 'react'; // 1. Added useState
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, UserCircle } from 'lucide-react';
import axios from 'axios'; // 2. Added Axios
import './Auth.css';

const Register = () => {
  const navigate = useNavigate();

  // 3. State to store what the user types
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'attendee'
  });

  // 4. Function to update the state as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 5. Function to send data to the Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // POST request to your Node.js server
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      
      alert(res.data.msg); // Shows "User registered successfully"
      navigate("/login");  // Moves to login page after success
    } catch (err) {
      // Shows error message (e.g., "User already exists")
      alert(err.response?.data?.msg || "Registration Failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>
        <p>Join the EventMaster community</p>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <User size={20} />
            <input 
              type="text" 
              name="name" // Matches state key
              placeholder="Full Name" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <Mail size={20} />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              onChange={handleChange} 
              required 
            />
          </div>
          
          <div className="input-group">
            <Lock size={20} />
            <input 
              type="password" 
              name="password" 
              placeholder="Password" 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="input-group">
            <UserCircle size={20} />
            <select name="role" onChange={handleChange} required>
              <option value="attendee">Attendee</option>
              <option value="organizer">Event Organizer</option>
            </select>
          </div>

          <button type="submit" className="auth-btn">Register</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;