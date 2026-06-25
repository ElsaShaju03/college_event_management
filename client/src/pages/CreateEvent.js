import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, LogOut, PlusSquare, ArrowLeft, Image as ImageIcon, Save } from 'lucide-react';
import './CreateEvent.css';
import './AdminDashboard.css';

const CreateEvent = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const user = JSON.parse(localStorage.getItem('user'));
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: 'Technical',
    organizer: user?.name || 'Admin',
    registrationLink: '',
    registrationDeadline: ''
  });

  useEffect(() => {
    if (isEditMode) {
      const fetchEventDetails = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/events/${id}`);
          // Ensure date strings are formatted correctly for input fields (YYYY-MM-DD)
          const data = res.data;
          if (data.date) data.date = data.date.split('T')[0];
          if (data.registrationDeadline) data.registrationDeadline = data.registrationDeadline.split('T')[0];
          setFormData(data);
        } catch (err) {
          alert("Error fetching event details");
        }
      };
      fetchEventDetails();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('date', formData.date);
    data.append('venue', formData.venue);
    data.append('category', formData.category);
    data.append('organizer', formData.organizer);
    data.append('registrationLink', formData.registrationLink);
    // CRITICAL FIX: Appending the deadline so the backend can receive it
    data.append('registrationDeadline', formData.registrationDeadline); 
    
    if (image) {
      data.append('image', image); 
    }

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}` 
        }
      };

      if (isEditMode) {
        await axios.put(`http://localhost:5000/api/events/update/${id}`, data, config);
        alert("Event updated successfully!");
      } else {
        await axios.post('http://localhost:5000/api/events/add', data, config);
        alert("Event published successfully!");
      }
      
      navigate("/admin-dashboard");
    } catch (err) {
      alert(err.response?.data?.error || err.response?.data?.msg || "Failed to save event");
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin<span>Portal</span></h2>
        <ul>
          <li><Link to="/admin-dashboard"><LayoutDashboard size={18}/> Dashboard</Link></li>
          <li><Link to="/manage-users"><Users size={18}/> Users</Link></li>
          <li><Link to="/events"><Calendar size={18}/> View Site Events</Link></li>
          <li className={!isEditMode ? "active" : ""}><Link to="/create-event"><PlusSquare size={18}/> Create Event</Link></li>
          <hr style={{border: '0.5px solid #333', margin: '15px 0'}} />
          <li><Link to="/" style={{color: '#aaa'}}><ArrowLeft size={18}/> Student View</Link></li>
        </ul>
        <button onClick={handleLogout} className="admin-logout-btn"><LogOut size={18} /> Logout</button>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <h1>{isEditMode ? "Edit Event Details" : "Create New Event"}</h1>
          <p style={{color: '#888'}}>
            {isEditMode ? "Modify the existing fields below." : "Fill in the details to publish a new event."}
          </p>
        </header>

        <section className="create-event-section">
          <form className="admin-event-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} rows="3" onChange={handleChange} required></textarea>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Venue</label>
                <input type="text" name="venue" value={formData.venue} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Cover Photo {isEditMode && "(Leave blank to keep current photo)"}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#1a1a1a', padding: '10px', borderRadius: '8px', border: '1px solid #333' }}>
                <ImageIcon size={20} color="#ff9800" />
                <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required={!isEditMode} />
              </div>
            </div>

            <div className="form-group">
              <label>Organizer Name</label>
              <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Registration Deadline (Last Date to Register)</label>
              <input 
                type="date" 
                name="registrationDeadline" 
                value={formData.registrationDeadline ? formData.registrationDeadline.split('T')[0] : ""} 
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Google Form / Registration Link</label>
              <input type="url" name="registrationLink" value={formData.registrationLink} onChange={handleChange} required />
            </div>

            <button type="submit" className="admin-submit-btn">
              {isEditMode ? <><Save size={18}/> Save Changes</> : "Publish Event"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreateEvent;