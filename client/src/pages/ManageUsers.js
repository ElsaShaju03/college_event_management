import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserCheck, UserX, ShieldAlert, UserCog } from 'lucide-react';
import './ManageUsers.css';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
        const res = await axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleRoleChange = async (id, newRole) => {
        await axios.patch(`http://localhost:5000/api/admin/users/role/${id}`, { role: newRole }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
    };

    const handleStatusToggle = async (id) => {
        await axios.patch(`http://localhost:5000/api/admin/users/status/${id}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchUsers();
    };

    return (
        <div className="manage-users-page">
            <h1>User Management</h1>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>
                                <select value={user.role} onChange={(e) => handleRoleChange(user._id, e.target.value)}>
                                    <option value="attendee">Attendee</option>
                                    <option value="organizer">Coordinator</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </td>
                            <td>
                                <span className={`status-pill ${user.status.toLowerCase()}`}>{user.status}</span>
                            </td>
                            <td>
                                <button onClick={() => handleStatusToggle(user._id)} className="btn-toggle">
                                    {user.status === 'Active' ? <UserX size={18} color="#ff4444"/> : <UserCheck size={18} color="#44ff44"/>}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManageUsers;
