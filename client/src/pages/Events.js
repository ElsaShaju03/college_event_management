import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, User, Laptop, Music, Trophy, BookOpen, Star, PlusCircle, Edit, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Events.css';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [events, setEvents] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const userData = JSON.parse(localStorage.getItem('user'));
  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/events/all');
        const visibleEvents = isAdmin 
          ? res.data 
          : res.data.filter(event => event.status === 'Approved');
        
        setEvents(visibleEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setLoading(false);
      }
    };
    fetchEvents();
  }, [isAdmin]);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All Categories" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <div className="loading-text">Loading Events...</div>;
  }

  return (
    <div className="events-page">
      <nav className="navbar">
        <div className="nav-logo">EVENT<span>MASTER</span></div>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li className="active"><Link to="/events">Events</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>
        <div className="nav-icons">
          <Link to="/login">
            <User className="icon" size={20} />
          </Link>
        </div>
      </nav>

      <header className="events-header">
        <div className="header-content">
          <h1>{isAdmin ? "MANAGE EVENTS" : "CAMPUS EVENTS"}</h1>
          <div className="underline"></div>
          <p>Explore upcoming college events and activities</p>
          
          {isAdmin && (
            <Link to="/create-event" className="admin-action-link">
              <button className="btn-admin-main">
                <PlusCircle size={20} /> Create New Event
              </button>
            </Link>
          )}
        </div>
      </header>

      <div className="container">
        <section className="filter-bar">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by event title..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
          <select 
            className="filter-select" 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All Categories">All Categories</option>
            <option value="Technical">Technical</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
            <option value="Workshop">Workshop</option>
          </select>
        </section>

        <section className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => {
              // --- DEADLINE LOGIC ---
              const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);

              return (
                <div key={event._id} className="event-card">
                  <div 
                    className="card-image"
                    style={{
                      backgroundImage: event.image 
                        ? `url(http://localhost:5000/uploads/${event.image})` 
                        : `none`,
                      backgroundColor: '#333',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                     <span className="category-badge">{event.category}</span>
                  </div>
                  <div className="card-body">
                    {/* Updated status tag logic for deadline */}
                    <div className={`status-tag ${isDeadlinePassed ? 'closed' : event.status.toLowerCase()}`}>
                      {isDeadlinePassed 
                        ? "🔴 Registration Closed" 
                        : event.status === "Approved" ? "🟢 Registration Open" : `🟡 ${event.status}`}
                    </div>
                    
                    <h3>{event.title}</h3>
                    <p><Calendar size={14} /> {event.date}</p>
                    <p><MapPin size={14} /> {event.venue}</p>
                    <p><User size={14} /> {event.organizer}</p>
                    
                    <div className="card-btns">
                      {isAdmin ? (
                        <Link to={`/edit-event/${event._id}`} className="btn-edit-link" style={{flex: 1, display: 'flex'}}>
                          <button className="btn-edit-admin" style={{width: '100%'}}>
                            <Edit size={16} /> Edit
                          </button>
                        </Link>
                      ) : (
                        /* Student Button Logic: Only show Link if deadline NOT passed */
                        !isDeadlinePassed ? (
                          <a 
                            href={event.registrationLink} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="btn-reg-link"
                          >
                            <button className="btn-reg">
                              Register <ExternalLink size={14} style={{marginLeft: '5px'}} />
                            </button>
                          </a>
                        ) : (
                          /* If deadline passed, show a disabled-looking button */
                          <button 
                            className="btn-reg" 
                            disabled 
                            style={{ backgroundColor: '#222', border: '1px solid #444', color: '#666', cursor: 'not-allowed', flex: 1 }}
                          >
                            Closed
                          </button>
                        )
                      )}
                      
                      <Link to={`/event-details/${event._id}`} style={{ flex: 1, display: 'flex' }}>
                          <button className="btn-details" style={{ width: '100%' }}>Details</button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state">
              <p>No events found matching your criteria.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Events;