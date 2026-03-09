import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Trash2, Edit } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const metroStations = [
    "20 Yanvar", "28 May", "8 Noyabr", "Avtovağzal", "Azadlıq prospekti", "Bakmil",
    "Cəfər Cabbarlı", "Dərnəgül", "Elmlər Akademiyası", "Əhmədli", "Gənclik",
    "Həzi Aslanov", "Xalqlar Dostluğu", "Xocəsən", "İçərişəhər", "İnşaatçılar",
    "Koroğlu", "Memar Əcəmi", "Nəriman Nərimanov", "Nəsimi", "Neftçilər", "Nizami",
    "Qara Qarayev", "Sahil", "Şah İsmayıl Xətai", "Ulduz"
].sort((a, b) => a.localeCompare(b, 'az'));

const regions = [
    "Abşeron", "Ağdam", "Ağdaş", "Ağcabədi", "Ağstafa", "Ağsu", "Astara", "Babək",
    "Bakı", "Balakən", "Bərdə", "Beyləqan", "Biləsuvar", "Daşkəsən", "Füzuli",
    "Gədəbəy", "Gəncə", "Goranboy", "Göyçay", "Göygöl", "Hacıqabul", "İmişli",
    "İsmayıllı", "Cəbrayıl", "Cəlilabad", "Culfa", "Kəlbəcər", "Xaçmaz", "Xankəndi",
    "Xocalı", "Xocavənd", "Xızı", "Kürdəmir", "Laçın", "Lənkəran", "Lerik",
    "Masallı", "Mingəçevir", "Naftalan", "Naxçıvan", "Neftçala", "Oğuz", "Ordubad",
    "Qəbələ", "Qax", "Qazax", "Quba", "Qubadlı", "Qusar", "Saatlı", "Sabirabad",
    "Sədərək", "Salyan", "Samux", "Şabran", "Şahbuz", "Şəki", "Şamaxı", "Şəmkir",
    "Şərur", "Şirvan", "Şuşa", "Siyəzən", "Sumqayıt", "Tərtər", "Tovuz", "Ucar",
    "Yardımlı", "Yevlax", "Zəngilan", "Zaqatala", "Zərdab"
].sort((a, b) => a.localeCompare(b, 'az'));

const Admin = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        title: '', transactionType: 'satish', category: 'menzil',
        location: 'bakı', metro: '', price: '', rooms: '', area: '', description: ''
    });
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchProperties();
    }, []);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('adminToken');
        return { Authorization: `Bearer ${token}` };
    };

    const fetchProperties = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/properties`);
            setProperties(res.data.properties);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 15) {
            alert('Maksimum 15 şəkil yükləyə bilərsiniz!');
            e.target.value = '';
            setImages([]);
            return;
        }
        setImages(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }

        images.forEach(img => {
            data.append('images', img);
        });

        try {
            if (editingId) {
                await axios.put(`${API_URL}/api/properties/${editingId}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() }
                });
                alert('Elan məlumatları yeniləndi!');
            } else {
                await axios.post(`${API_URL}/api/properties`, data, {
                    headers: { 'Content-Type': 'multipart/form-data', ...getAuthHeaders() }
                });
                alert('Elan uğurla əlavə edildi!');
            }

            setEditingId(null);
            setFormData({
                title: '', transactionType: 'satish', category: 'menzil',
                location: 'bakı', metro: '', price: '', rooms: '', area: '', description: ''
            });
            setImages([]);
            document.getElementById('imageInput').value = '';
            fetchProperties();
        } catch (error) {
            console.error(error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                alert('Sessiya bitib, yenidən daxil olun');
                localStorage.removeItem('adminToken');
                navigate('/login');
            } else {
                alert('Elan əlavə edilərkən xəta baş verdi');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bu elanı silmək istədiyinizə əminsiniz?")) return;

        try {
            await axios.delete(`${API_URL}/api/properties/${id}`, { headers: getAuthHeaders() });
            fetchProperties();
        } catch (error) {
            console.error(error);
            alert("Silinərkən xəta baş verdi");
        }
    };

    const handleEditItem = (p) => {
        setEditingId(p.id);
        setFormData({
            title: p.title || '',
            transactionType: p.transactionType || 'satish',
            category: p.category || 'menzil',
            location: p.location || 'bakı',
            metro: p.metro || '',
            price: p.price || '',
            rooms: p.rooms || '',
            area: p.area || '',
            description: p.description || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div style={{ backgroundColor: 'var(--bg-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />

            <div className="container admin-section" style={{ flex: 1 }}>
                <div className="admin-header">
                    <h2>Admin Panel - Elan İdarəetməsi</h2>
                </div>

                <div className="admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                        <h3>{editingId ? 'Elanı Düzənlə' : 'Yeni Elan Əlavə Et'}</h3>
                        {editingId && (
                            <button type="button" onClick={() => {
                                setEditingId(null);
                                setFormData({ title: '', transactionType: 'satish', category: 'menzil', location: 'bakı', metro: '', price: '', rooms: '', area: '', description: '' });
                            }} style={{ padding: '8px 16px', background: 'var(--bg-light)', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}>
                                Yeni Əlavəyə Qayıt
                            </button>
                        )}
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Elan Başlığı</label>
                            <input type="text" className="form-input" name="title" value={formData.title} onChange={handleInputChange} required placeholder="Məs. Təcili satılır 3 otaqlı menzil..." />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Əməliyyat növü</label>
                                <select className="form-input" name="transactionType" value={formData.transactionType} onChange={handleInputChange}>
                                    <option value="satish">Satış</option>
                                    <option value="alish">Kirayə</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Kateqoriya</label>
                                <select className="form-input" name="category" value={formData.category} onChange={handleInputChange}>
                                    <option value="menzil">Mənzil</option>
                                    <option value="heyet_evi">Həyət evi</option>
                                    <option value="qaraj">Qaraj</option>
                                    <option value="obyekt">Obyekt</option>
                                    <option value="torpaq">Torpaq</option>
                                    <option value="ofis">Ofis</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Yerləşmə (Şəhər/Rayon)</label>
                                <select className="form-input" name="location" value={formData.location} onChange={e => { handleInputChange(e); if (e.target.value !== 'bakı') setFormData(prev => ({ ...prev, metro: '' })); }} required>
                                    <option value="">Seçin</option>
                                    {regions.map(r => <option key={r} value={r.toLowerCase()}>{r}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Qiymət (AZN)</label>
                                <input type="number" className="form-input" name="price" value={formData.price} onChange={handleInputChange} required />
                            </div>
                        </div>

                        {formData.location === 'bakı' && (
                            <div className="form-group">
                                <label>Metro Stansiyası</label>
                                <select className="form-input" name="metro" value={formData.metro} onChange={handleInputChange}>
                                    <option value="">Seçin (İxtiyari)</option>
                                    {metroStations.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        )}

                        <div className="form-row">
                            <div className="form-group">
                                <label>Otaq Sayı (İxtiyari)</label>
                                <input type="number" className="form-input" name="rooms" value={formData.rooms} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Sahə (kv.m və ya sot)</label>
                                <input type="number" className="form-input" name="area" value={formData.area} onChange={handleInputChange} />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Şəkil yüklə (Maks 15 ədəd){editingId && " - Yeni şəkil seçmək əvvəlkiləri siləcək"}</label>
                            <input type="file" multiple className="form-input" id="imageInput" accept="image/*" onChange={handleFileChange} style={{ padding: '10px' }} />
                        </div>

                        <div className="form-group">
                            <label>Təsvir</label>
                            <textarea className="form-textarea" name="description" value={formData.description} onChange={handleInputChange} placeholder="Əmlak barədə əlavə məlumat..."></textarea>
                        </div>

                        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', height: '48px', marginTop: '10px', backgroundColor: editingId ? '#10b981' : 'var(--primary-color)' }}>
                            {loading ? 'Gözləyin...' : (editingId ? 'Yadda Saxla' : 'Elanı Yarat')}
                        </button>
                    </form>
                </div>

                <div className="admin-card">
                    <h3 style={{ marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>Mövcud Elanlar</h3>
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                    <th style={{ padding: '12px' }}>ID</th>
                                    <th style={{ padding: '12px' }}>Şəkil</th>
                                    <th style={{ padding: '12px' }}>Başlıq</th>
                                    <th style={{ padding: '12px' }}>Şəkil Sayı</th>
                                    <th style={{ padding: '12px' }}>Qiymət</th>
                                    <th style={{ padding: '12px' }}>Əməliyyat</th>
                                </tr>
                            </thead>
                            <tbody>
                                {properties.map(p => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '12px' }}>#{p.id}</td>
                                        <td style={{ padding: '12px' }}>
                                            {p.images && p.images.length > 0 ? (
                                                <img src={`${API_URL}${p.images[0]}`} alt="cover" style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                                            ) : (
                                                <div style={{ width: '50px', height: '50px', background: '#e2e8f0', borderRadius: '4px' }}></div>
                                            )}
                                        </td>
                                        <td style={{ padding: '12px' }}>{p.title}</td>
                                        <td style={{ padding: '12px' }}>{p.images ? p.images.length : 0} ədəd</td>
                                        <td style={{ padding: '12px', fontWeight: 'bold' }}>{p.price.toLocaleString()} AZN</td>
                                        <td style={{ padding: '12px' }}>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleEditItem(p)} style={{ color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Edit size={18} /> Düzənlə
                                                </button>
                                                <button onClick={() => handleDelete(p.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Trash2 size={18} /> Sil
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {properties.length === 0 && (
                                    <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Heç bir elan yoxdur</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Admin;
