import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './CreateEvent.css';

const UploadGallery = () => {
    const [file, setFile] = useState(null);
    const [data, setData] = useState({ title: '', category: 'Technical', mediaType: 'image' });
    const navigate = useNavigate();

    const handleUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', data.title);
        formData.append('category', data.category);
        formData.append('mediaType', data.mediaType);

        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/gallery/upload', formData, {
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        });
        alert("Memory Added!");
        navigate('/gallery');
    };

    return (
        <div className="admin-layout">
            <main className="admin-content">
                <h1>Upload to Gallery</h1>
                <form className="admin-event-form" onSubmit={handleUpload}>
                    <input type="text" placeholder="Title" onChange={e => setData({...data, title: e.target.value})} required />
                    <select onChange={e => setData({...data, category: e.target.value})}>
                        <option value="Technical">Technical</option>
                        <option value="Cultural">Cultural</option>
                        <option value="Sports">Sports</option>
                    </select>
                    <select onChange={e => setData({...data, mediaType: e.target.value})}>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                    </select>
                    <input type="file" onChange={e => setFile(e.target.files[0])} required />
                    <button type="submit" className="admin-submit-btn">Upload Now</button>
                </form>
            </main>
        </div>
    );
};

export default UploadGallery;