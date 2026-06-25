import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Cpu, Globe, Database, Lock, Info, Users, CheckCircle, Search, User, LogOut } from 'lucide-react';
import './About.css';

const About = () => {
  const navigate = useNavigate();

  // Get user data safely for consistent Navbar behavior
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="about-page">
      {/* Updated Navigation Bar */}
      <nav className="navbar">
        <div className="nav-logo">EVENT<span>MASTER</span></div>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li className="active"><Link to="/about">About</Link></li>
          <li><Link to="/events">Events</Link></li>
          {/* Updated Gallery link to be clickable */}
          <li><Link to="/gallery">Gallery</Link></li>
          
          {isAdmin && (
            <li><Link to="/admin-dashboard" style={{color: '#ff9800', fontWeight: 'bold'}}>Dashboard</Link></li>
          )}
        </ul>

        <div className="nav-icons">
          <Search className="icon" size={20} />
          
          {token ? (
             <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
                <Link to={isAdmin ? "/admin-dashboard" : "/events"}>
                    <User className="icon" size={20} />
                </Link>
                <LogOut className="icon" size={20} onClick={handleLogout} style={{color: '#ff4444', cursor: 'pointer'}} />
             </div>
          ) : (
            <Link to="/login">
              <User className="icon" size={20} />
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Header */}
      <header className="about-header">
        <div className="header-content">
          <h1>ABOUT US</h1>
          <div className="underline"></div>
          <p>The vision behind your college event hub</p>
        </div>
      </header>

      <div className="container">
        {/* 1. Introduction */}
        <section className="about-section">
          <div className="section-title">
            <Info className="title-icon" />
            <h2>Introduction</h2>
          </div>
          <p>
            This Event Management Website is a web-based platform developed to manage and organize college events efficiently. 
            It provides a centralized system where students can easily access event information, and administrators can manage 
            events in a structured and secure manner.
          </p>
        </section>

        {/* 2. Why This Platform? */}
        <section className="about-section highlight-box">
          <div className="section-title">
            <Users className="title-icon" />
            <h2>Why This Platform?</h2>
          </div>
          <p>
            In many colleges, event information is shared through notice boards, WhatsApp groups, or social media, which often 
            leads to missed updates and confusion. This platform was created to overcome these challenges by providing a 
            single, reliable source for all event-related information with real-time updates.
          </p>
        </section>

        {/* 3. Technology Used */}
        <section className="about-section">
          <div className="section-title">
            <Cpu className="title-icon" />
            <h2>Technology Used</h2>
          </div>
          <div className="tech-grid">
            <div className="tech-card">
              <Globe color="#ff9800" size={32} />
              <h4>Frontend</h4>
              <p>React.js</p>
            </div>
            <div className="tech-card">
              <Cpu color="#ff9800" size={32} />
              <h4>Backend</h4>
              <p>Node.js & Express.js</p>
            </div>
            <div className="tech-card">
              <Database color="#ff9800" size={32} />
              <h4>Database</h4>
              <p>MongoDB</p>
            </div>
            <div className="tech-card">
              <Lock color="#ff9800" size={32} />
              <h4>Authentication</h4>
              <p>JWT (JSON Web Token)</p>
            </div>
            <div className="tech-card">
              <ShieldCheck color="#ff9800" size={32} />
              <h4>File Uploads</h4>
              <p>Multer</p>
            </div>
          </div>
        </section>

        {/* 4. Security */}
        <section className="about-section security-box">
          <div className="section-title">
            <Lock className="title-icon" />
            <h2>Security</h2>
          </div>
          <p>
            The platform uses JWT-based authentication to ensure secure access. Role-based authorization is implemented 
            to restrict administrative functionalities to authorized users only. Sensitive routes are protected using 
            middleware to prevent unauthorized access.
          </p>
          <div className="security-features">
            <span><CheckCircle size={14} /> Encrypted Passwords</span>
            <span><CheckCircle size={14} /> Role-Based Access Control</span>
            <span><CheckCircle size={14} /> Protected API Endpoints</span>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;