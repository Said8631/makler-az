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
                                ? 'toastSlideOut 0.4s cubic-bezier(.4,0,.2,1) forwards'
                                : 'toastSlideIn 0.4s cubic-bezier(.4,0,.2,1) forwards',
                            background: toast.type === 'success' ? 'linear-gradient(135deg,#1a7f4e,#22c55e)'
                                : toast.type === 'error' ? 'linear-gradient(135deg,#9b1c1c,#ef4444)'
                                : toast.type === 'warning' ? 'linear-gradient(135deg,#92400e,#f59e0b)'
                                : 'linear-gradient(135deg,#1e40af,#3b82f6)',
                            color: '#fff',
                            backdropFilter: 'blur(8px)',
                        }}
                    >
                        <span style={{ fontSize: '20px', flexShrink: 0, marginTop: '1px' }}>
                            {toast.type === 'success' ? '✅'
                                : toast.type === 'error' ? '❌'
                                : toast.type === 'warning' ? '⚠️'
                                : 'ℹ️'}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 500, lineHeight: 1.5, flex: 1 }}>
                            {toast.message}
                        </span>
                        <span style={{ fontSize: '18px', opacity: 0.7, flexShrink: 0, marginTop: '-2px' }}>×</span>
                    </div>
                ))}
            </div>
            <style>{`
                @keyframes toastSlideIn {
                    from { opacity: 0; transform: translateX(120px) scale(0.9); }
                    to   { opacity: 1; transform: translateX(0) scale(1); }
                }
                @keyframes toastSlideOut {
                    from { opacity: 1; transform: translateX(0) scale(1); }
                    to   { opacity: 0; transform: translateX(120px) scale(0.9); }
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
