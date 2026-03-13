import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Search, MapPin, Home as HomeIcon, Maximize, Heart, Bed, Square } from 'lucide-react';
import { useToast } from '../components/Toast';

const API_URL = import.meta.env.VITE_API_URL || '';

const categoryNames = { menzil: "Mənzil", heyet_evi: "Həyət evi", qaraj: "Qaraj", obyekt: "Obyekt", torpaq: "Torpaq", ofis: "Ofis" };
const metroStations = [
    "20 Yanvar", "28 May", "8 Noyabr", "Avtovağzal", "Azadlıq prospekti", "Bakmil",
    "Cəfər Cabbarlı", "Dərnəgül", "Elmlər Akademiyası", "Əhmədli", "Gənclik",
    "Həzi Aslanov", "Xalqlar Dostluğu", "Xocəsən", "İçərişəhər", "İnşaatçılar",
    "Koroğlu", "Memar Əcəmi", "Nəriman Nərimanov", "Nəsimi", "Neftçilər", "Nizami",
    "Qara Qarayev", "Sahil", "Şah İsmayıl Xətai", "Ulduz"
].sort((a, b) => a.localeCompare(b, 'az'));

const Home = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [favorites, setFavorites] = useState([]);

    const [transactionType, setTransactionType] = useState('satish');
    const [category, setCategory] = useState('menzil');
    const [location, setLocation] = useState('');
    const [metro, setMetro] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');

    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const userToken = localStorage.getItem('userToken');
    const adminToken = localStorage.getItem('adminToken');

    const getAuthHeaders = () => ({
        Authorization: `Bearer ${userToken}`,
    });

    useEffect(() => {
        fetchProperties();
        if (userToken) {
            fetchFavorites();
        }
    }, [userToken]);

    const fetchFavorites = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/user/favorites`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setFavorites(res.data.properties.map(p => p._id)); // Store only IDs
        } catch (error) {
            console.error('Error fetching favorites', error);
        }
    };

    useEffect(() => {
        if (!searchInput.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const delayDebounceFn = setTimeout(async () => {
            try {
                const res = await axios.get(`${API_URL}/api/properties?searchQuery=${encodeURIComponent(searchInput)}`);
                setSearchResults(res.data.properties);
                setShowDropdown(true);
            } catch (error) {
                console.error(error);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchInput]);

    const fetchProperties = async (params = {}) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams(params).toString();
            const res = await axios.get(`${API_URL}/api/properties?${queryParams}`);
            setProperties(res.data.properties);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        const params = { transactionType, ...(category && { category }), ...(location && { location }), ...(metro && { metro }), ...(priceMin && { priceMin }), ...(priceMax && { priceMax }), ...(searchInput && { searchQuery: searchInput }) };
        fetchProperties(params);
        setShowDropdown(false);
    };

    const toggleFavorite = async (e, property) => {
        e.stopPropagation();

        if (!userToken) {
            addToast('Sevimlilərə əlavə etmək üçün zəhmət olmasa adi istifadəçi kimi daxil olun.', 'warning');
            if (!adminToken) navigate('/user-login');
            return;
        }
        if (adminToken) {
            addToast('Adminlər sevimlilərə əlavə edə bilməz.', 'info');
            return;
        }

        const propId = property._id || property.id;
        const isFav = isFavorite(propId);

        try {
            if (isFav) {
                await axios.delete(`${API_URL}/api/user/favorites/${propId}`, { headers: getAuthHeaders() });
                setFavorites(prev => prev.filter(favId => favId !== propId));
                addToast('Sevimlilərdən silindi', 'info');
            } else {
                await axios.post(`${API_URL}/api/user/favorites`, { property_id: propId }, { headers: getAuthHeaders() });
                setFavorites(prev => [...prev, propId]);
                addToast('Sevimlilərə əlavə edildi!', 'success');
            }
        } catch (error) {
            console.error('Error toggling favorite', error);
            addToast('Xəta baş verdi. Zəhmət olmasa yenidən yoxlayın.', 'error');
        }
    };

    const isFavorite = (id) => favorites.includes(id);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', paddingBottom: '70px' }}>
            <Header />

            <section className="hero-section">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1 className="hero-title">Xəyallarınızdakı əmlakı tapın</h1>
                    <p className="hero-subtitle">Azərbaycanın hər yerində minlərlə etibarlı daşınmaz əmlak elanı</p>
                    <div className="search-box">
                        <div className="type-toggles">
                            <label className="toggle-btn"><input type="radio" value="satish" checked={transactionType === 'satish'} onChange={() => setTransactionType('satish')} /><span>Satış</span></label>
                            <label className="toggle-btn"><input type="radio" value="alish" checked={transactionType === 'alish'} onChange={() => setTransactionType('alish')} /><span>Kirayə</span></label>
                        </div>

                        {/* Live Search Input */}
                        <div style={{ position: 'relative', marginBottom: '20px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Ərazi, metro, ünvan daxil edin... (məs. Memar Əcəmi)"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onFocus={() => { if (searchInput.trim()) setShowDropdown(true); }}
                                    style={{ paddingLeft: '48px', height: '56px', fontSize: '16px' }}
                                />
                            </div>

                            {/* Autocomplete Dropdown */}
                            {showDropdown && searchInput && (
                                <div style={{
                                    position: 'absolute', top: '100%', left: 0, right: 0,
                                    background: 'white', border: '1px solid var(--border-color)',
                                    borderRadius: '8px', marginTop: '4px', zIndex: 1000,
                                    boxShadow: 'var(--shadow-lg)', maxHeight: '300px', overflowY: 'auto'
                                }}>
                                    {searchResults.length > 0 ? (
                                        searchResults.map(p => (
                                            <div key={p._id || p.id} className="dropdown-item" onClick={() => navigate(`/property/${p._id || p.id}`)} style={{
                                                padding: '12px 16px', borderBottom: '1px solid var(--border-color)',
                                                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px'
                                            }}>
                                                {p.images && p.images.length > 0 ? (
                                                    <img src={p.images[0].startsWith('http') ? p.images[0] : `${API_URL}${p.images[0]}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} alt="" />
                                                ) : (
                                                    <div style={{ width: '50px', height: '50px', background: '#e2e8f0', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HomeIcon size={20} color="#94a3b8" /></div>
                                                )}
                                                <div>
                                                    <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>{p.price.toLocaleString()} AZN</div>
                                                    <div style={{ fontSize: '14px', color: 'var(--text-main)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.title}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> <span style={{ textTransform: 'capitalize' }}>{p.location}</span></div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text-muted)' }}>Uyğun elan tapılmadı</div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="filter-row main-filters">
                            <div className="filter-group"><label>KATEQORİYA</label><select className="native-select" value={category} onChange={e => setCategory(e.target.value)}>{Object.entries(categoryNames).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
                            <div className="filter-group"><label>ŞƏHƏR</label><select className="native-select" value={location} onChange={e => { setLocation(e.target.value); if (e.target.value !== 'bakı') setMetro(''); }}><option value="">Bütün Azərbaycan</option><option value="bakı">Bakı</option><option value="sumqayit">Sumqayıt</option></select></div>

                            {location === 'bakı' && (
                                <div className="filter-group"><label>METRO</label><select className="native-select" value={metro} onChange={e => setMetro(e.target.value)}><option value="">Bütün stansiyalar</option>{metroStations.map(m => <option key={m} value={m}>{m}</option>)}</select></div>
                            )}

                            <div className="filter-group price-group" style={{ gridColumn: location === 'bakı' ? 'span 1' : 'span 2' }}>
                                <label>QİYMƏT (AZN)</label><div className="price-inputs"><input type="number" placeholder="Min" value={priceMin} onChange={e => setPriceMin(e.target.value)} /><span>-</span><input type="number" placeholder="Max" value={priceMax} onChange={e => setPriceMax(e.target.value)} /></div>
                            </div>
                            <div className="filter-group action-group" style={{ gridColumn: location === 'bakı' ? 'span 1' : 'span 1' }}>
                                <button className="search-btn" onClick={handleSearch} disabled={loading}><Search size={20} />{loading ? 'Axtarılır...' : 'Axtar'}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            <section className="listings-section container" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 'bold' }}>Yeni Elanlar</h2>
                </div>

                {properties.length === 0 && !loading && (
                    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>Uyğun elan tapılmadı.</div>
                )}

                <div className="listings-grid">
                    {properties.map((p, index) => (
                        <div key={p._id} className="property-card" onClick={() => navigate(`/property/${p._id || p.id}`)} style={{ cursor: 'pointer', position: 'relative', animationDelay: `${index * 0.1}s` }}>
                            <button
                                onClick={(e) => toggleFavorite(e, p)}
                                style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', zIndex: 10 }}
                                title={userToken ? "Sevimlilərə əlavə et" : "Qeydiyyat tələb olunur"}
                            >
                                <Heart size={20} color={isFavorite(p._id || p.id) ? '#ef4444' : '#94a3b8'} fill={isFavorite(p._id || p.id) ? '#ef4444' : 'none'} />
                            </button>

                            {p.images && p.images.length > 0 ? (
                                <img src={p.images[0].startsWith('http') ? p.images[0] : `${API_URL}${p.images[0]}`} alt={p.title} className="property-image" />
                            ) : (
                                <div className="property-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><HomeIcon size={48} /></div>
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
        </div >
    );
};

export default Home;
