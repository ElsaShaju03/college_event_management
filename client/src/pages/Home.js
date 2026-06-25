import React, { useState } from 'react';
import { 
  User, 
  ChevronLeft, 
  ChevronRight, 
  LogOut, 
  Mail, 
  Shield, 
  UserCircle 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import heroBg from '../assets/images/home.jpg';

const Home = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  // Get user data from LocalStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    setShowDropdown(false);
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* --- HEADER / NAVIGATION BAR --- */}
      <nav className="navbar">
        <div className="nav-logo">EVENT<span>MASTER</span></div>
        
        <ul className="nav-menu">
          <li className="active"><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/events">Events</Link></li>
          
          {/* Show Admin Dashboard link only if role is admin */}
          {isAdmin && (
            <li><Link to="/admin-dashboard" className="admin-nav-link">Dashboard</Link></li>
          )}
          
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>

        <div className="nav-icons">
          {token ? (
             <div className="profile-wrapper">
                {/* User Icon - Toggles Dropdown */}
                <div 
                  className={`icon-circle ${showDropdown ? 'active' : ''}`} 
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <User size={22} />
                </div>

                {/* --- PROFILE DROPDOWN CARD --- */}
                {showDropdown && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <UserCircle size={45} color="#ff9800" />
                      <h4>{user?.name || 'User'}</h4>
                      <span className="badge">{user?.role}</span>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-body">
                      <div className="info-row">
                        <Mail size={16} />
                        <span>{user?.email}</span>
                      </div>
                      <div className="info-row">
                        <Shield size={16} />
                        <span>{user?.role === 'admin' ? 'Full Access' : 'Student Access'}</span>
                      </div>
                    </div>

                    <button className="logout-action-btn" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
             </div>
          ) : (
            /* If not logged in, icon leads directly to login */
            <Link to="/login">
              <div className="icon-circle">
                <User size={22} />
              </div>
            </Link>
          )}
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="hero-section" style={{ backgroundImage: `url(${heroBg})` }}>
        <div className="hero-overlay"></div>
        
        {/* Carousel Controls (Visual only) */}
        <ChevronLeft className="slider-arrow left" size={48} />
        <ChevronRight className="slider-arrow right" size={48} />

        <div className="hero-content">
          <h4>ONE STOP</h4>
          <h1>EVENT PLANNER</h1>
          <p>Every event should be perfect</p>
          
          <div className="hero-btns">
            {isAdmin ? (
                <Link to="/admin-dashboard">
                    <button className="btn-filled">Manage System</button>
                </Link>
            ) : (
                <Link to="/about">
                    <button className="btn-filled">About Us</button>
                </Link>
            )}

            <Link to="/login">
              <button className="btn-outline">Get Started</button>
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Home;