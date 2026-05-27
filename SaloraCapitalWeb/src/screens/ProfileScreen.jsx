import React from 'react';
import { Icon, useToast } from '../components/index.jsx';
import { COLORS, RADIUS, SHADOWS } from '../utils/theme.js';
import logo from '../logo.png';
import bp from '../betterplace.png';

const buildSupportItems = (toast) => [
  {
    icon: 'phone',
    label: 'Call Us',
    sub: '+91 9876543210',
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
    action: () => window.open('tel:+919876543210'),
  },
  {
    icon: 'whatsapp',
    label: 'WhatsApp Support',
    sub: 'Chat with us on WhatsApp',
    iconBg: '#F0FFF4',
    iconColor: '#16A34A',
    action: () => window.open('https://wa.me/919876543210', '_blank'),
  },
  {
    icon: 'email-outline',
    label: 'Email Support',
    sub: 'support@saloracapital.com',
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
    action: () => window.open('mailto:support@saloracapital.com'),
  },
  {
    icon: 'file-document-outline',
    label: 'Grievance Redressal',
    sub: 'Submit your grievance',
    iconBg: '#FFF5F5',
    iconColor: '#DC2626',
    action: () => toast.info('Grievance portal coming soon.'),
  },
  {
    icon: 'map-marker-outline',
    label: 'Office Address',
    sub: 'Salora Capital, New Delhi, India',
    iconBg: '#F0F4FF',
    iconColor: '#2563EB',
    action: () => window.open('https://maps.google.com/?q=New+Delhi,India', '_blank'),
  },
  {
    icon: 'shield-lock-outline',
    label: 'Privacy Policy',
    sub: 'Read our privacy policy',
    iconBg: '#F5F5FF',
    iconColor: '#7C3AED',
    action: () => window.open('https://saloracapital.com/privacy', '_blank'),
  },
  {
    icon: 'file-check-outline',
    label: 'Terms & Conditions',
    sub: 'Read our T&C',
    iconBg: '#F5FAFF',
    iconColor: '#0284C7',
    action: () => window.open('https://saloracapital.com/terms', '_blank'),
  },
];

const HOW_TO_STEPS = [
  {
    step: '1',
    title: 'Find Your Loan',
    desc: 'Enter your registered mobile number or PAN to locate your loan.',
    icon: 'magnify',
  },
  {
    step: '2',
    title: 'Select EMI to Pay',
    desc: 'View your EMI schedule and choose the installment you want to pay.',
    icon: 'calendar-check-outline',
  },
  {
    step: '3',
    title: 'Pay Securely',
    desc: 'Complete payment on our secure gateway and receive instant confirmation.',
    icon: 'shield-check',
  },
];

export default function ProfileScreen() {
  const toast = useToast();
  const SUPPORT_ITEMS = buildSupportItems(toast);
  return (
    <div style={{ background: COLORS.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ background: COLORS.primary, padding: '16px 20px 20px' }}>
        <h1 style={{ color: COLORS.white, fontSize: '18px', fontWeight: '700' }}>Profile</h1>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>

        {/* Brand Card */}
        <div
          style={{
            background: `linear-gradient(145deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: RADIUS.xl,
            padding: 24,
            marginBottom: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            boxShadow: '0 6px 24px rgba(10,31,68,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(240,90,40,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: RADIUS.xl,
              background: COLORS.white,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
              padding: 8,
              position: 'relative',
              zIndex: 1,
            }}
          >
            <img src={logo} alt="Salora Capital" style={{ width: '100%', objectFit: 'contain' }} />
          </div>

          <h2 style={{ color: COLORS.white, fontSize: '18px', fontWeight: '800', marginBottom: 4, position: 'relative', zIndex: 1 }}>
            Salora Capital
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '13px', marginBottom: 16, position: 'relative', zIndex: 1 }}>
            Your Trusted Lending Partner
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255,255,255,0.12)',
              borderRadius: RADIUS.full,
              padding: '8px 16px',
              border: '1px solid rgba(255,255,255,0.2)',
              position: 'relative',
              zIndex: 1,
            }}
          >
            <img src={bp} alt="BetterPlace" style={{ height: 22, objectFit: 'contain' }} />
            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.3)' }} />
            <span style={{ color: COLORS.white, fontSize: '12px', fontWeight: '600' }}>LSP Partner</span>
          </div>
        </div>

        {/* How To Use */}
        <div style={{ background: COLORS.white, borderRadius: RADIUS.lg, boxShadow: SHADOWS.card, padding: 18, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Icon name="information-outline" size={18} color={COLORS.primary} />
            <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '15px' }}>How to Use</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {HOW_TO_STEPS.map((step, idx) => (
              <div key={step.step} style={{ display: 'flex', gap: 12 }}>
                {/* Step number + line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      background: COLORS.orange,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(240,90,40,0.3)',
                    }}
                  >
                    <span style={{ color: COLORS.white, fontWeight: '800', fontSize: '13px' }}>{step.step}</span>
                  </div>
                  {idx < HOW_TO_STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: COLORS.border, marginTop: 4 }} />
                  )}
                </div>
                {/* Text */}
                <div style={{ paddingTop: 4, paddingBottom: idx < HOW_TO_STEPS.length - 1 ? 14 : 0 }}>
                  <p style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '14px', marginBottom: 3 }}>{step.title}</p>
                  <p style={{ color: COLORS.textSecondary, fontSize: '12px', lineHeight: 1.5 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div style={{ background: COLORS.white, borderRadius: RADIUS.lg, boxShadow: SHADOWS.card, overflow: 'hidden', marginBottom: 16 }}>
          <div style={{ padding: '14px 16px', borderBottom: `1px solid ${COLORS.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="headset" size={18} color={COLORS.primary} />
              <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '15px' }}>Support & Info</span>
            </div>
          </div>

          {SUPPORT_ITEMS.map((item, idx) => (
            <button
              key={item.label}
              onClick={item.action}
              style={{
                width: '100%',
                padding: '13px 16px',
                borderBottom: idx < SUPPORT_ITEMS.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 13,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = COLORS.borderLight; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Icon Box */}
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: RADIUS.md,
                  background: item.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Icon name={item.icon} size={20} color={item.iconColor} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: COLORS.textPrimary, fontWeight: '600', fontSize: '14px', marginBottom: 2 }}>{item.label}</p>
                <p style={{ color: COLORS.textMuted, fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.sub}
                </p>
              </div>

              <Icon name="chevron-right" size={18} color={COLORS.textMuted} />
            </button>
          ))}
        </div>

        {/* App Version */}
        <p style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: '12px' }}>
          Salora Capital Web • v1.0.0
        </p>
      </div>
    </div>
  );
}
