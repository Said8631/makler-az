import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const About = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'var(--bg-light)' }}>
            <Header />
            <div className="container" style={{ flex: 1, padding: '60px 20px', maxWidth: '800px' }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: 'var(--shadow-md)' }}>
                    <h1 style={{ fontSize: '36px', marginBottom: '24px', color: 'var(--primary-color)' }}>Haqqımızda</h1>

                    <div style={{ lineHeight: '1.8', fontSize: '16px', color: 'var(--text-main)' }}>
                        <p style={{ marginBottom: '16px' }}>
                            <strong>Makler.az</strong> fəaliyyətinə 2024-cü ildə başlamışdır və məqsədi vətəndaşlara
                            ən etibarlı və sərfəli daşınmaz əmlak elanlarını təqdim etməkdir. Bizim platforma alıcılar ilə
                            əmlak sahiblərini və ya təcrübəli maklerləri ən sürətli və təhlükəsiz şəkildə birləşdirir.
                        </p>

                        <h3 style={{ fontSize: '22px', marginTop: '30px', marginBottom: '12px' }}>Makler Fəqan Hüseynov</h3>
                        <p style={{ marginBottom: '16px' }}>
                            Platformanın qurucusu və əsas məsləhətçisi olan Fəqan Hüseynov, daşınmaz əmlak sahəsində <strong>20 illik</strong> zəngin təcrübəyə malikdir.
                            Müştərilərin məmnuniyyəti, doğru qiymətləndirmə və güvən həmişə onun üçün prioritet olmuşdur.
                            Satış, alış, kirayə və ya əmlak yatırımı barədə istənilən məsləhət üçün bizə etibar edə bilərsiniz.
                        </p>

                        <div style={{ background: 'var(--bg-light)', padding: '20px', borderRadius: '8px', marginTop: '30px', borderLeft: '4px solid var(--primary-color)' }}>
                            <p style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>
                                "Əmlak sadəcə divar deyil, həm də gələcəyə bir yatırımdır." - Fəqan Hüseynov
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default About;
