import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Events from './pages/Events';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateEvent from './pages/CreateEvent';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import About from './pages/About'; 
import Gallery from './pages/Gallery';
import UploadGallery from './pages/UploadGallery';
import EventDetails from './pages/EventDetails';
import './App.css';

// --- ADMIN PROTECTION COMPONENT ---
const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* --- PUBLIC / STUDENT INTERFACE ROUTES --- */}
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/event-details/:id" element={<EventDetails />} />
          

          {/* --- PROTECTED ADMIN INTERFACE ROUTES --- */}
          
          <Route 
            path="/admin-dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          <Route 
            path="/manage-users" 
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            } 
          />

          {/* Route for Creating a New Event */}
          <Route 
            path="/create-event" 
            element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            } 
          />

          {/* Route for Editing an Existing Event (Reusing CreateEvent Component) */}
          <Route 
            path="/edit-event/:id" 
            element={
              <AdminRoute>
                <CreateEvent />
              </AdminRoute>
            } 
          />
          <Route path="/admin/upload-gallery" 
          element={<AdminRoute><UploadGallery />
          </AdminRoute>
        } 
        />

        </Routes>
      </div>
    </Router>
  );
}

export default App;