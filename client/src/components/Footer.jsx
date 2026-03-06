import React from 'react';
import { MapPin, Instagram, Phone, Info, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer-modern" style={{ marginTop: 'auto' }}>
            <div className="container">
                <div className="footer-modern-grid">

                    {/* Qisa Melumat */}
                    <div className="footer-modern-col">
                        <div className="footer-brand">
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 9.5L12 3L21 9.5V20C21 20.2652 20.8946 20.5196 20.7071 20.7071C20.5196 20.8946 20.2652 21 20 21H4C3.73478 21 3.48043 20.8946 3.29289 20.7071C3.10536 20.5196 3 20.2652 3 20V9.5Z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M9 21V12H15V21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span>Makler.az</span>
                        </div>
                        <p className="footer-desc">
                            Makler.az fəaliyyətinə 2024-cü ildə başlamışdır və məqsədi vətəndaşlara
                            ən etibarlı və sərfəli daşınmaz əmlak elanlarını təqdim etməkdir.
                        </p>
                        <Link to="/about" className="footer-link-highlight">
                            Haqqımızda daha ətraflı <ArrowRight size={16} />
                        </Link>
                    </div>

                    {/* Suretli Kecidler */}
                    <div className="footer-modern-col">
                        <h3>Sürətli Keçidlər</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Əsas Səhifə</Link></li>
                            <li><Link to="/favorites">Sevimlilər</Link></li>
                            <li><Link to="/about">Haqqımızda</Link></li>
                            <li><Link to="/contact">Əlaqə</Link></li>
                        </ul>
                    </div>

                    {/* Elaqe */}
                    <div className="footer-modern-col">
                        <h3>Bizimlə Əlaqə</h3>
                        <ul className="footer-contact">
                            <li>
                                <div className="icon-box"><Phone size={18} /></div>
                                <div>
                                    <span>Telefon</span>
                                    <strong>+994 55 219 11 86</strong>
                                </div>
                            </li>
                            <li>
                                <div className="icon-box"><MapPin size={18} /></div>
                                <div>
                                    <span>Ofis</span>
                                    <strong>CR65+WGJ, 20 Yanvar</strong>
                                </div>
                            </li>
                            <li>
                                <div className="icon-box instagram"><Instagram size={18} /></div>
                                <div>
                                    <span>Instagram</span>
                                    <a href="https://instagram.com/emlak.sahibinden" target="_blank" rel="noreferrer">@emlak.sahibinden</a>
                                </div>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="footer-modern-bottom">
                    <p>&copy; {new Date().getFullYear()} Makler.az - Bütün hüquqlar qorunur.</p>
                    <p className="developer-tag">Powered by Said Ibrahimov</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
