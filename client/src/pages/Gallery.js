import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Image as ImageIcon, Video, PlusCircle, User, Search } from 'lucide-react';
import './Gallery.css';

const Gallery = () => {
    const [media, setMedia] = useState([]);
    const [filter, setFilter] = useState('All');
    
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        const fetchGallery = async () => {
            const res = await axios.get('http://localhost:5000/api/gallery/all');
            setMedia(res.data);
        };
        fetchGallery();
    }, []);

    const filteredMedia = filter === 'All' ? media : media.filter(item => item.category === filter);

    return (
        <div className="gallery-page">
            <nav className="navbar">
                <div className="nav-logo">EVENT<span>MASTER</span></div>
                <ul className="nav-menu">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                    <li><Link to="/events">Events</Link></li>
                    <li className="active"><Link to="/gallery">Gallery</Link></li>
                </ul>
                <div className="nav-icons">
                    <Search className="icon" size={20} />
                    <Link to="/login"><User className="icon" size={20} /></Link>
                </div>
            </nav>

            <header className="gallery-header">
                <h1>EVENT MEMORIES</h1>
                <div className="underline"></div>
                <div className="filter-tabs">
                    {['All', 'Technical', 'Cultural', 'Sports'].map(cat => (
                        <button key={cat} className={filter === cat ? 'active' : ''} onClick={() => setFilter(cat)}>{cat}</button>
                    ))}
                </div>
                {isAdmin && (
                    <Link to="/admin/upload-gallery">
                        <button className="btn-admin-add"><PlusCircle size={18} /> Add to Gallery</button>
                    </Link>
                )}
            </header>

            <div className="container">
                <div className="gallery-grid">
                    {filteredMedia.map(item => (
                        <div key={item._id} className="gallery-item">
                            {item.mediaType === 'image' ? (
                                <img src={`http://localhost:5000/uploads/${item.fileUrl}`} alt={item.title} />
                            ) : (
                                <video controls>
                                    <source src={`http://localhost:5000/uploads/${item.fileUrl}`} type="video/mp4" />
                                </video>
                            )}
                            <div className="gallery-overlay">
                                <span>{item.category}</span>
                                <h4>{item.title}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Gallery;