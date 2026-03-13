import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Bed, Square, Image as ImageIcon, Heart } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();
    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');

    useEffect(() => {
        if (!userToken) {
            alert('Sevimlilərə baxmaq üçün zəhmət olmasa daxil olun.');
            if (!adminToken) navigate('/user-login');
            return;
        }

        const fetchFavorites = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/user/favorites`, {
                    headers: { Authorization: `Bearer ${userToken}` }
                });
                setFavorites(res.data.properties);
            } catch (error) {
                console.error('Error fetching favorites', error);
            }
        };

        fetchFavorites();
    }, [navigate, userToken]);

    const toggleFavorite = async (e, property) => {
        e.stopPropagation();
        try {
            const propId = property._id || property.id;
            await axios.delete(`${API_URL}/api/user/favorites/${propId}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setFavorites(favorites.filter(p => (p._id || p.id) !== propId));
        } catch (error) {
            console.error('Error removing favorite', error);
        }
    };

    if (!userToken) return <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}><Header /><div style={{ flex: 1, padding: '40px', textAlign: 'center' }}>Bu səhifə yalnız istifadəçilər üçündür.</div><Footer /></div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-light)', paddingBottom: '70px' }}>
            <Header />

            <section className="container" style={{ flex: 1, padding: '40px 20px' }}>
                <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Seçilmiş Elanlar ({favorites.length})</h2>
                <p style={{ color: 'var(--text-muted)' }}>Bəyəndiyiniz bütün əmlaklar</p>

                {favorites.length === 0 && (
                    <div style={{ marginTop: '80px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '18px' }}>
                        Seçilmiş elanınız yoxdur. Ürək iconuna klikləyərək elanları buraya əlavə edə bilərsiniz.
                    </div>
                )}

                <div className="listings-grid">
                    {favorites.map(p => (
                        <div key={p._id || p.id} className="property-card" onClick={() => navigate(`/property/${p._id || p.id}`)} style={{ cursor: 'pointer', position: 'relative' }}>
                            <button
                                onClick={(e) => toggleFavorite(e, p)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10 }}
                            >
                                <Heart size={20} color="#ef4444" fill="#ef4444" />
                            </button>

                            {p.images && p.images.length > 0 ? (
                                <img src={p.images[0].startsWith('http') ? p.images[0] : `${API_URL}${p.images[0]}`} alt={p.title} className="property-image" />
                            ) : (
                                <div className="property-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><ImageIcon size={48} /></div>
                            )}
                            <div className="property-info">
                                <div className="property-price">{p.price.toLocaleString()} AZN</div>
                                <h3 className="property-title">{p.title}</h3>
                                <div className="property-meta" style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {p.rooms && <span><Bed size={16} /> {p.rooms} otaq</span>}
                                    {p.area && <span><Square size={16} /> {p.area} {p.category === 'torpaq' ? 'sot' : 'm²'}</span>}
                                </div>
                                <div className="property-location"><MapPin size={16} /><span style={{ textTransform: 'capitalize' }}>{p.location}</span></div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Favorites;
