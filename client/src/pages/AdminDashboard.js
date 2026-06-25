import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
    Users, 
    Calendar, 
    CheckCircle, 
    XCircle, 
    BarChart3, 
    ShieldCheck, 
    LogOut, 
    LayoutDashboard, 
    PlusSquare, 
    Image as ImageIcon 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalUsers: 0, totalEvents: 0, pendingEvents: 0 });
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // Fetch stats and all events from backend
                const statsRes = await axios.get('http://localhost:5000/api/admin/stats', config);
                const eventsRes = await axios.get('http://localhost:5000/api/events/all');
                
                setStats(statsRes.data);
                setEvents(eventsRes.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching admin data", err);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    localStorage.clear();
                    navigate('/login');
                }
                setLoading(false);
            }
        };
        fetchAdminData();
    }, [navigate]);

    const handleStatus = async (id, status) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`http://localhost:5000/api/admin/event-status/${id}`, { status }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            window.location.reload(); 
        } catch (err) {
            alert("Update failed");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    if (loading) {
        return <div className="loading-screen" style={{color:'white', textAlign:'center', marginTop:'50px'}}>Loading Admin Portal...</div>;
    }

    return (
        <div className="admin-layout">
            {/* --- SIDEBAR NAVIGATION --- */}
            <aside className="admin-sidebar">
                <h2>Admin<span>Portal</span></h2>
                <ul>
                    <li className="active">
                        <Link to="/admin-dashboard"><BarChart3 size={18}/> Dashboard</Link>
                    </li>
                    <li>
                        <Link to="/manage-users"><Users size={18}/> Manage Users</Link>
                    </li>
                    <li>
                        <Link to="/events"><Calendar size={18}/> View All Events</Link>
                    </li>
                    <li>
                        <Link to="/create-event"><PlusSquare size={18}/> Create Event</Link>
                    </li>
                    {/* NEW LINK ADDED HERE */}
                    <li>
                        <Link to="/admin/upload-gallery"><ImageIcon size={18}/> Manage Gallery</Link>
                    </li>
                    
                    {/* BACK TO STUDENT INTERFACE */}
                    <li className="nav-divider"></li>
                    <li>
                        <Link to="/" style={{color: '#aaa'}}><LayoutDashboard size={18}/> Student View</Link>
                    </li>
                </ul>

                <button onClick={handleLogout} className="admin-logout-btn">
                    <LogOut size={18} /> Logout
                </button>
            </aside>

            {/* --- MAIN CONTENT AREA --- */}
            <main className="admin-content">
                <header className="admin-header">
                    <h1>System Overview</h1>
                    <div className="admin-badge">Administrator Mode</div>
                </header>
                
                {/* Statistics Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <Users color="#ff9800" size={32} />
                        <div><h4>Total Users</h4><p>{stats.totalUsers}</p></div>
                    </div>
                    <div className="stat-card">
                        <Calendar color="#ff9800" size={32} />
                        <div><h4>Total Events</h4><p>{stats.totalEvents}</p></div>
                    </div>
                    <div className="stat-card">
                        <CheckCircle color="#4caf50" size={32} />
                        <div><h4>Pending Approvals</h4><p>{stats.pendingEvents}</p></div>
                    </div>
                </div>

                {/* Approval Table */}
                <div className="management-section">
                    <div className="section-header">
                        <h2>Event Approval Queue</h2>
                        <span className="count-tag">{stats.pendingEvents} Pending</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Event Name</th>
                                <th>Organizer</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.length > 0 ? (
                                events.map(event => (
                                    <tr key={event._id}>
                                        <td>{event.title}</td>
                                        <td>{event.organizer}</td>
                                        <td><span className={`badge ${event.status.toLowerCase()}`}>{event.status}</span></td>
                                        <td>
                                            {event.status === 'Pending' ? (
                                                <div className="action-btns">
                                                    <button onClick={() => handleStatus(event._id, 'Approved')} className="btn-approve" title="Approve"><CheckCircle size={20}/></button>
                                                    <button onClick={() => handleStatus(event._id, 'Rejected')} className="btn-reject" title="Reject"><XCircle size={20}/></button>
                                                </div>
                                            ) : (
                                                <span style={{color: '#555', fontSize: '12px'}}>No actions needed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="4" style={{textAlign: 'center', padding: '30px', color: '#666'}}>No events found in the database.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;