import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Heart, Home as HomeIcon, Info, Phone, User, PlusCircle } from 'lucide-react'

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const adminToken = localStorage.getItem('adminToken');
    const userToken = localStorage.getItem('userToken');
    const username = localStorage.getItem('username');

    const handleAdminLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/');
    };

    const handleUserLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('username');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'active-link' : '';

    return (
        <>
            <header className="main-header">
                <div className="container header-content">
                    <Link to="/" className="logo">
                        <img src="/makler-az-logo.png.png" alt="Makler.az Logo" style={{ height: '50px', width: 'auto' }} />
                    </Link>

                    <nav className="nav-links">
                        <Link to="/" className={isActive('/')}>Əsas Səhifə</Link>
                        <Link to="/about" className={isActive('/about')}>Haqqımızda</Link>
                        <Link to="/contact" className={isActive('/contact')}>Əlaqə</Link>

                        <Link to="/favorites" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ef4444' }}>
                            <Heart size={20} /> Sevimlilər
                        </Link>

                        {/* If Admin logged in */}
                        {adminToken && (
                            <>
                                <Link to="/admin" className="btn-primary" style={{ backgroundColor: '#0F172A' }}>Admin Panel</Link>
                                <Link to="/admin" className="btn-primary">+ Elan yerləşdir</Link>
                                <button onClick={handleAdminLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>Admin Çıxış</button>
                            </>
                        )}

                        {/* If regular user logged in */}
                        {!adminToken && userToken && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <span style={{ fontWeight: '600', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}><User size={18} /> {username}</span>
                                <button onClick={handleUserLogout} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontWeight: 'bold' }}>Çıxış</button>
                            </div>
                        )}

                        {/* Unauthenticated User */}
                        {!adminToken && !userToken && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <Link to="/user-login" style={{ fontWeight: '600', color: 'var(--text-main)' }}>Giriş</Link>
                                <Link to="/register" className="btn-primary" style={{ padding: '8px 20px' }}>Qeydiyyat</Link>
                            </div>
                        )}
                    </nav>
                </div>
            </header>

            {/* Mobile Bottom Navbar */}
            <nav className="mobile-bottom-nav">
                <Link to="/" className={`mobile-nav-item ${isActive('/')}`}>
                    <HomeIcon size={24} />
                    <span>Ana Səhifə</span>
                </Link>
                <Link to="/favorites" className={`mobile-nav-item ${isActive('/favorites')}`}>
                    <Heart size={24} />
                    <span>Sevimlilər</span>
                </Link>
                {adminToken ? (
                    <Link to="/admin" className={`mobile-nav-item ${isActive('/admin')}`}>
                        <PlusCircle size={24} />
                        <span>Yeni Elan</span>
                    </Link>
                ) : (
                    <Link to="/contact" className={`mobile-nav-item ${isActive('/contact')}`}>
                        <Phone size={24} />
                        <span>Əlaqə</span>
                    </Link>
                )}
                <Link to={userToken || adminToken ? "#" : "/user-login"} onClick={userToken ? handleUserLogout : (adminToken ? handleAdminLogout : undefined)} className={`mobile-nav-item ${isActive('/user-login')}`}>
                    <User size={24} />
                    <span>{userToken || adminToken ? 'Çıxış' : 'Profil'}</span>
                </Link>
            </nav>
        </>
    )
}

export default Header
