import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User, Tag, ArrowLeft, ExternalLink } from 'lucide-react';
import axios from 'axios';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details");
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading) return <div className="loading-text">Loading details...</div>;
  if (!event) return <div className="loading-text">Event not found.</div>;

  return (
    <div className="details-page">
      <nav className="navbar">
        <div className="nav-logo">EVENT<span>MASTER</span></div>
        <ul className="nav-menu">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/events">Events</Link></li>
          <li><Link to="/gallery">Gallery</Link></li>
        </ul>
      </nav>

      <div className="details-container">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} /> Back to Events
        </button>

        <div className="details-content">
          <div className="details-image-section">
            <img 
              src={event.image ? `http://localhost:5000/uploads/${event.image}` : 'https://via.placeholder.com/800x400'} 
              alt={event.title} 
            />
            <span className="details-category">{event.category}</span>
          </div>

          <div className="details-info-section">
            <div className="status-badge">🟢 {event.status}</div>
            <h1>{event.title}</h1>
            
            <div className="meta-grid">
              <div className="meta-item">
                <Calendar color="#ff9800" />
                <div>
                  <p className="label">Date</p>
                  <p className="value">{event.date}</p>
                </div>
              </div>
              <div className="meta-item">
                <MapPin color="#ff9800" />
                <div>
                  <p className="label">Venue</p>
                  <p className="value">{event.venue}</p>
                </div>
              </div>
              <div className="meta-item">
                <User color="#ff9800" />
                <div>
                  <p className="label">Organizer</p>
                  <p className="value">{event.organizer}</p>
                </div>
              </div>
            </div>

            <div className="description-box">
              <h3>About the Event</h3>
              <p>{event.description}</p>
            </div>

            <a href={event.registrationLink} target="_blank" rel="noopener noreferrer" className="reg-btn-large">
              Register Now <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;