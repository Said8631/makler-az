import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_URL || '';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/api/register`, { username, password });
            if (res.data.success) {
                alert('Qeydiyyat uğurla tamamlandı. Zəhmət olmasa daxil olun.');
                navigate('/user-login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Qeydiyyat zamanı xəta baş verdi');
        }
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: '400px' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Qeydiyyat</h2>
                    {error && <div style={{ color: 'red', marginBottom: '16px', textAlign: 'center', background: '#fee2e2', padding: '10px', borderRadius: '8px' }}>{error}</div>}
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>İstifadəçi adı</label>
                            <input type="text" className="form-input" value={username} onChange={e => setUsername(e.target.value)} required placeholder="Məs. gunel123" />
                        </div>
                        <div className="form-group">
                            <label>Şifrə</label>
                            <input type="password" className="form-input" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Şifrəniz" />
                        </div>
                        <button type="submit" className="search-btn" style={{ marginTop: '20px' }}>Qeydiyyatdan Keç</button>
                    </form>
                    <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>
                        Artıq hesabınız var? <Link to="/user-login" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Daxil Ol</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Register;
