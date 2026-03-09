import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { MapPin, Instagram, Phone, Mail } from 'lucide-react';

const Contact = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
            <Header />
            <div className="container" style={{ flex: 1, padding: '60px 20px', maxWidth: '1000px' }}>
                <h1 style={{ fontSize: '36px', marginBottom: '30px', textAlign: 'center', color: 'var(--primary-color)' }}>Əlaqə</h1>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    {/* Info Card */}
                    <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                        <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>Bizimlə Əlaqə Saxlayın</h3>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '16px' }}>
                            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '50%', color: 'var(--primary-color)' }}>
                                <Phone size={24} />
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Telefon (Makler Fəqan)</div>
                                <strong>+994 55 219 11 86</strong>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '16px' }}>
                            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '50%', color: 'var(--primary-color)' }}>
                                <Mail size={24} />
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>E-poçt</div>
                                <strong>info@makler.az</strong>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', fontSize: '16px' }}>
                            <div style={{ background: '#fdf2f8', padding: '10px', borderRadius: '50%', color: '#E1306C' }}>
                                <Instagram size={24} />
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Instagram</div>
                                <a href="https://instagram.com/emlak.sahibinden" target="_blank" rel="noreferrer" style={{ fontWeight: 'bold', color: '#E1306C' }}>@emlak.sahibinden</a>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '16px' }}>
                            <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '50%', color: 'var(--primary-color)' }}>
                                <MapPin size={24} />
                            </div>
                            <div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Ofis Ünvanı</div>
                                <strong>CR65+WGJ, 20 Yanvar, Bakı</strong>
                            </div>
                        </div>
                    </div>

                    {/* Map Card */}
                    <div style={{ background: 'white', borderRadius: '12px', boxShadow: 'var(--shadow-md)', overflow: 'hidden', minHeight: '300px' }}>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.5861110051664!2d49.80917267591666!3d40.400262171442116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4030877995166061%3A0xe48727a3c3b038af!2zMjAgWWFudmFyIM0mYWtoYW5hc8Sx!5e0!3m2!1sen!2saz!4v1700000000000!5m2!1sen!2saz"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade">
                        </iframe>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Contact;
