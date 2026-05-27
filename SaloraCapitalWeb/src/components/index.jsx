import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { COLORS, SHADOWS, RADIUS } from '../utils/theme.js';

// ─── Toast ───────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

const TOAST_CONFIGS = {
  success: { icon: 'check-circle', color: COLORS.success, bg: '#F0FDF4', border: COLORS.success },
  error:   { icon: 'alert-circle', color: COLORS.danger,  bg: '#FEF2F2', border: COLORS.danger },
  info:    { icon: 'information',  color: '#2563EB',      bg: '#EFF6FF', border: '#2563EB' },
  warning: { icon: 'alert',        color: COLORS.warning, bg: COLORS.warningLight, border: COLORS.warning },
};

function ToastItem({ toast, onClose }) {
  const [visible, setVisible] = useState(false);
  const cfg = TOAST_CONFIGS[toast.type] || TOAST_CONFIGS.info;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose(toast.id), 200);
  };

  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: RADIUS.md,
        boxShadow: SHADOWS.large,
        borderLeft: `4px solid ${cfg.border}`,
        padding: '12px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        minWidth: 260,
        maxWidth: 360,
        transform: visible ? 'translateX(0)' : 'translateX(120%)',
        opacity: visible ? 1 : 0,
        transition: 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s ease',
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: cfg.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={cfg.icon} size={18} color={cfg.color} />
      </div>
      <p style={{ flex: 1, color: COLORS.textPrimary, fontSize: '13px', fontWeight: '500', lineHeight: 1.45, paddingTop: 4 }}>
        {toast.message}
      </p>
      <button
        onClick={handleClose}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 2,
          marginTop: 2,
          color: COLORS.textMuted,
          display: 'flex',
        }}
        aria-label="Close"
      >
        <Icon name="close" size={14} color={COLORS.textMuted} />
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(0);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((type, message, duration = 3500) => {
    const id = ++idRef.current;
    setToasts(prev => [...prev, { id, type, message }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const api = {
    success: (msg, d) => show('success', msg, d),
    error:   (msg, d) => show('error', msg, d),
    info:    (msg, d) => show('info', msg, d),
    warning: (msg, d) => show('warning', msg, d),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 10000,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          pointerEvents: 'none',
        }}
      >
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onClose={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}

// ─── Icon ────────────────────────────────────────────────────────────────────
export function Icon({ name, size = 20, color = COLORS.textPrimary, style = {} }) {
  return (
    <span
      className={`mdi mdi-${name}`}
      style={{
        fontSize: size + 'px',
        color,
        lineHeight: '1',
        display: 'inline-block',
        ...style,
      }}
    />
  );
}

// ─── LoadingOverlay ───────────────────────────────────────────────────────────
export function LoadingOverlay({ visible, message = 'Loading...' }) {
  if (!visible) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(10, 31, 68, 0.75)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          background: COLORS.white,
          borderRadius: RADIUS.lg,
          padding: '32px 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
          boxShadow: SHADOWS.large,
          minWidth: 200,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            border: `3px solid ${COLORS.border}`,
            borderTopColor: COLORS.orange,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
        <p style={{ color: COLORS.textPrimary, fontWeight: '600', fontSize: '15px', textAlign: 'center' }}>
          {message}
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const configs = {
    paid: { bg: COLORS.successLight, color: COLORS.success, label: 'Paid', icon: 'check-circle' },
    overdue: { bg: COLORS.dangerLight, color: COLORS.danger, label: 'Overdue', icon: 'alert-circle' },
    due: { bg: COLORS.warningLight, color: COLORS.warning, label: 'Due', icon: 'clock-outline' },
    active: { bg: COLORS.successLight, color: COLORS.success, label: 'Active', icon: 'check-circle' },
    closed: { bg: COLORS.border, color: COLORS.textMuted, label: 'Closed', icon: 'close-circle' },
  };
  const cfg = configs[status?.toLowerCase()] || configs.due;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: cfg.bg,
        color: cfg.color,
        borderRadius: RADIUS.full,
        padding: '3px 10px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'nowrap',
      }}
    >
      <Icon name={cfg.icon} size={12} color={cfg.color} />
      {cfg.label}
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: RADIUS.lg,
        boxShadow: SHADOWS.card,
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
