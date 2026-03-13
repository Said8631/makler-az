import React, { useState, useEffect, useCallback } from 'react';

// Toast Context
export const ToastContext = React.createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 4000) => {
        const id = ++toastId;
        setToasts(prev => [...prev, { id, message, type, closing: false }]);
        setTimeout(() => {
            setToasts(prev => prev.map(t => t.id === id ? { ...t, closing: true } : t));
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, 400);
        }, duration);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, closing: true } : t));
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 400);
    }, []);

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxWidth: '380px',
                width: 'calc(100vw - 40px)',
                pointerEvents: 'none',
            }}>
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        onClick={() => removeToast(toast.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                            padding: '14px 16px',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                            cursor: 'pointer',
                            pointerEvents: 'all',
                            animation: toast.closing
                                ? 'toastSlideOut 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards'
                                : 'toastSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                            background: toast.type === 'success' ? 'rgba(21, 128, 61, 0.95)'
                                : toast.type === 'error' ? 'rgba(185, 28, 28, 0.95)'
                                : toast.type === 'warning' ? 'rgba(180, 83, 9, 0.95)'
                                : 'rgba(29, 78, 216, 0.95)',
                            color: '#fff',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '2px' }}>
                            {toast.type === 'success' ? '✨'
                                : toast.type === 'error' ? '🌋'
                                : toast.type === 'warning' ? '⚡'
                                : '💎'}
                        </span>
                        <span style={{ fontSize: '15px', fontWeight: 600, lineHeight: 1.4, flex: 1 }}>
                            {toast.message}
                        </span>
                        <span style={{ fontSize: '22px', opacity: 0.8, flexShrink: 0, marginTop: '-3px', cursor: 'pointer' }}>×</span>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(40px) translateY(-10px) scale(0.9); }
                    to   { opacity: 1; transform: translateX(0) translateY(0) scale(1); }
                }
                @keyframes toastSlideOut {
                    from { opacity: 1; transform: translateX(0) scale(1); }
                    to   { opacity: 0; transform: translateX(60px) scale(0.8); }
                }
            `}</style>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const ctx = React.useContext(ToastContext);
    if (!ctx) throw new Error('useToast must be used within ToastProvider');
    return ctx;
};
