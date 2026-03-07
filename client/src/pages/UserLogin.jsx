import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const UserLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (username === 'Feqan' && password === 'Feqan1234F') {
                const res = await axios.post(`${API_URL}/api/login`, { username, password });
                if (res.data.success) {
                    localStorage.setItem('adminToken', res.data.token);
                    navigate('/admin');
                }
            } else {
                const res = await axios.post(`${API_URL}/api/user/login`, { username, password });
                if (res.data.success) {
                    localStorage.setItem('userToken', res.data.token);
                    localStorage.setItem('username', res.data.username);
                    navigate('/');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Giriş uğursuz oldu');
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>İstifadəçi Girişi</h2>
                    {error && <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>{error}</div>}
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>İstifadəçi adı</label>
                            <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} required placeholder="İstifadəçi adınız" />
                        </div>
                        <div className="form-group">
                            <label>Şifrə</label>
                            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Şifrəniz" />
                        </div>
                        <button type="submit" className="search-btn" style={{ marginTop: '20px' }}>Daxil Ol</button>
                    </form>
                    <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Hesabınız yoxdur? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Qeydiyyatdan Keç</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default UserLogin;
