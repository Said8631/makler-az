import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Bed, Square, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [property, setProperty] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch details
                const res = await axios.get(`${API_URL}/api/properties/${id}`);
                setProperty(res.data.property);

                // Fetch related (just grab all and slice for simplicity)
                const relRes = await axios.get(`${API_URL}/api/properties`);
                setRelated(relRes.data.properties.filter(p => p.id !== parseInt(id)).slice(0, 4));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}>Yüklənir...</div>;
    if (!property) return <div style={{ textAlign: 'center', padding: '100px' }}>Elan tapılmadı</div>;

    const nextImage = () => {
        setCurrentImageIndex(prev => (prev === property.images.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        setCurrentImageIndex(prev => (prev === 0 ? property.images.length - 1 : prev - 1));
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />

            <div className="container" style={{ padding: '40px 20px', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>

                    {/* Image Gallery */}
                    <div style={{ position: 'relative', width: '100%', maxWidth: '800px', margin: '0 auto', background: '#000', borderRadius: '12px', overflow: 'hidden', height: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {property.images && property.images.length > 0 ? (
                            <>
                                <img src={`${API_URL}${property.images[currentImageIndex]}`} alt="Əmlak" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                {property.images.length > 1 && (
                                    <>
                                        <button onClick={prevImage} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button onClick={nextImage} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.7)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <ChevronRight size={24} />
                                        </button>
                                        <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                                            {currentImageIndex + 1} / {property.images.length}
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <div style={{ color: '#fff', textAlign: 'center' }}><ImageIcon size={64} /><p>Şəkil yoxdur</p></div>
                        )}
                    </div>

                    {/* Details Info */}
                    <div style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                            <div>
                                <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>{property.title}</h1>
                                <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={18} /> {property.location}</span>
                                    {property.rooms && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Bed size={18} /> {property.rooms} otaq</span>}
                                    {property.area && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Square size={18} /> {property.area} {property.category === 'torpaq' ? 'sot' : 'kv.m'}</span>}
                                </div>
                            </div>
                            <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                {property.price.toLocaleString()} AZN
                            </div>
                        </div>

                        <div style={{ marginTop: '30px' }}>
                            <h3 style={{ fontSize: '20px', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Məlumat</h3>
                            <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', color: 'var(--text-main)' }}>
                                {property.description || 'Əlavə məlumat qeyd edilməyib.'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Related Properties */}
                {related.length > 0 && (
                    <div style={{ marginTop: '80px' }}>
                        <h3 style={{ fontSize: '24px', marginBottom: '20px' }}>Daha Çox Elanlar</h3>
                        <div className="listings-grid">
                            {related.map(p => (
                                <div key={p.id} className="property-card" onClick={() => navigate(`/property/${p.id}`)} style={{ cursor: 'pointer' }}>
                                    {p.images && p.images.length > 0 ? (
                                        <img src={`${API_URL}${p.images[0]}`} alt={p.title} className="property-image" />
                                    ) : (
                                        <div className="property-image" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}><ImageIcon size={48} /></div>
                                    )}
                                    <div className="property-info">
                                        <div className="property-price">{p.price.toLocaleString()} AZN</div>
                                        <h3 className="property-title">{p.title}</h3>
                                        <div className="property-meta">
                                            {p.rooms && <span><Bed size={16} /> {p.rooms} otaq</span>}
                                        </div>
                                        <div className="property-location"><MapPin size={16} /><span style={{ textTransform: 'capitalize' }}>{p.location}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>

            <Footer />
        </div>
    );
};

export default PropertyDetails;
