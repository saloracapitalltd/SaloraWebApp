import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoan } from '../context/LoanContext.jsx';
import { Icon, LoadingOverlay, useToast } from '../components/index.jsx';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../utils/theme.js';
import { fetchLoanSchedule, validatePhone, validatePAN } from '../utils/api.js';
import logo from '../logo.png';
import bp from '../betterplace.png';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { setLoan, setSearchInput, setSearchInputType } = useLoan();
  const toast = useToast();

  const [inputType, setInputType] = useState('mobile');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) {
      toast.warning(inputType === 'mobile' ? 'Please enter your mobile number.' : 'Please enter your PAN number.');
      return;
    }
    if (inputType === 'mobile' && !validatePhone(trimmed)) {
      toast.warning('Please enter a valid 10-digit mobile number starting with 6-9.');
      return;
    }
    if (inputType === 'pan' && !validatePAN(trimmed)) {
      toast.warning('Please enter a valid PAN number (e.g. ABCDE1234F).');
      return;
    }

    setLoading(true);
    try {
      const params = inputType === 'mobile' ? { mobile: trimmed } : { pan: trimmed.toUpperCase() };
      const loan = await fetchLoanSchedule(params);
      setLoan(loan);
      setSearchInput(trimmed);
      setSearchInputType(inputType);
      navigate('/customer', { state: { loan, input: trimmed, inputType } });
    } catch (err) {
      toast.error(err.message || 'Failed to fetch loan details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const switchTo = (type) => {
    setInputType(type);
    setInputValue('');
  };

  return (
    <div style={{ minHeight: '100vh', background: COLORS.background, display: 'flex', flexDirection: 'column' }}>
      <LoadingOverlay visible={loading} message="Fetching loan details..." />

      {/* Header */}
      <div
        style={{
          background: COLORS.primary,
          padding: '16px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <img src={logo} alt="Salora Capital" style={{ height: 36, objectFit: 'contain' }} />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.12)',
            borderRadius: RADIUS.full,
            padding: '6px 12px',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <img src={bp} alt="BetterPlace" style={{ height: 20, objectFit: 'contain' }} />
          <span style={{ color: COLORS.white, fontSize: '11px', fontWeight: '600', opacity: 0.9 }}>
            LSP Partner
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div
        style={{
          background: `linear-gradient(160deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          padding: '28px 20px 36px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(240,90,40,0.12)' }} />
        <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(240,90,40,0.2)',
              borderRadius: RADIUS.full,
              padding: '5px 12px',
              marginBottom: 14,
            }}
          >
            <Icon name="lightning-bolt" size={13} color={COLORS.orange} />
            <span style={{ color: COLORS.orange, fontSize: '12px', fontWeight: '700', letterSpacing: 0.5 }}>
              INSTANT EMI PAYMENT
            </span>
          </div>
          <h1 style={{ color: COLORS.white, fontSize: '26px', fontWeight: '800', lineHeight: 1.25, marginBottom: 10 }}>
            Pay Your EMI{'\n'}Instantly
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', lineHeight: 1.5, marginBottom: 20 }}>
            Secure, fast and hassle-free EMI payments for your Salora Capital loan.
          </p>

          {/* Trust Badges */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { icon: 'shield-check', label: '100% Secure' },
              { icon: 'flash', label: 'Instant' },
              { icon: 'headset', label: '24x7 Support' },
            ].map(badge => (
              <div
                key={badge.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'rgba(255,255,255,0.12)',
                  borderRadius: RADIUS.full,
                  padding: '5px 11px',
                  border: '1px solid rgba(255,255,255,0.15)',
                }}
              >
                <Icon name={badge.icon} size={13} color={COLORS.orange} />
                <span style={{ color: COLORS.white, fontSize: '11px', fontWeight: '600' }}>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '0 16px', marginTop: -16, paddingBottom: 80 }}>

        {/* Search Card */}
        <div
          style={{
            background: COLORS.white,
            borderRadius: RADIUS.xl,
            boxShadow: SHADOWS.medium,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 3, height: 20, background: COLORS.orange, borderRadius: 2 }} />
            <h2 style={{ color: COLORS.textPrimary, fontSize: '16px', fontWeight: '700' }}>Find Your Loan</h2>
          </div>

          {/* Toggle Buttons */}
          <div
            style={{
              display: 'flex',
              background: COLORS.background,
              borderRadius: RADIUS.md,
              padding: 3,
              marginBottom: 16,
            }}
          >
            {['mobile', 'pan'].map(type => (
              <button
                key={type}
                onClick={() => switchTo(type)}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  borderRadius: RADIUS.sm,
                  background: inputType === type ? COLORS.white : 'transparent',
                  color: inputType === type ? COLORS.orange : COLORS.textSecondary,
                  fontWeight: inputType === type ? '700' : '500',
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: inputType === type ? SHADOWS.card : 'none',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Icon
                  name={type === 'mobile' ? 'cellphone' : 'card-account-details-outline'}
                  size={15}
                  color={inputType === type ? COLORS.orange : COLORS.textSecondary}
                />
                {type === 'mobile' ? 'Mobile Number' : 'PAN Number'}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              border: `2px solid ${COLORS.border}`,
              borderRadius: RADIUS.md,
              overflow: 'hidden',
              marginBottom: 14,
              background: COLORS.background,
              transition: 'border-color 0.2s',
            }}
            onFocus={() => {}}
          >
            {inputType === 'mobile' && (
              <div
                style={{
                  padding: '12px 14px',
                  background: COLORS.borderLight,
                  borderRight: `1px solid ${COLORS.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  whiteSpace: 'nowrap',
                }}
              >
                <span style={{ fontSize: '18px' }}>🇮🇳</span>
                <span style={{ color: COLORS.textPrimary, fontWeight: '600', fontSize: '14px' }}>+91</span>
              </div>
            )}
            {inputType === 'pan' && (
              <div style={{ padding: '12px 14px', background: COLORS.borderLight, borderRight: `1px solid ${COLORS.border}` }}>
                <Icon name="card-account-details-outline" size={18} color={COLORS.textMuted} />
              </div>
            )}
            <input
              type={inputType === 'mobile' ? 'tel' : 'text'}
              inputMode={inputType === 'mobile' ? 'numeric' : 'text'}
              maxLength={inputType === 'mobile' ? 10 : 10}
              placeholder={inputType === 'mobile' ? 'Enter 10-digit mobile number' : 'Enter PAN (e.g. ABCDE1234F)'}
              value={inputValue}
              onChange={e => setInputValue(inputType === 'pan' ? e.target.value.toUpperCase() : e.target.value)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                padding: '13px 14px',
                background: 'transparent',
                fontSize: '15px',
                color: COLORS.textPrimary,
                fontWeight: '500',
                letterSpacing: inputType === 'pan' ? 1 : 0,
              }}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px 0',
              background: loading ? COLORS.textMuted : `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`,
              borderRadius: RADIUS.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: loading ? 'none' : '0 4px 16px rgba(240,90,40,0.35)',
              transition: 'all 0.2s',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <Icon name="magnify" size={18} color={COLORS.white} />
            <span style={{ color: COLORS.white, fontWeight: '700', fontSize: '15px' }}>View My Loan</span>
          </button>

          <p style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: '12px', marginTop: 12 }}>
            Enter the mobile number or PAN linked to your Salora Capital loan
          </p>
        </div>

        {/* Features Row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
          {[
            { icon: 'calendar-month-outline', label: 'EMI Schedule', desc: 'View all dues' },
            { icon: 'lightning-bolt', label: 'Quick Pay', desc: 'One-tap payment' },
            { icon: 'file-document-check-outline', label: 'Receipt', desc: 'Instant receipt' },
          ].map(feat => (
            <div
              key={feat.label}
              style={{
                flex: 1,
                background: COLORS.white,
                borderRadius: RADIUS.md,
                padding: '14px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                boxShadow: SHADOWS.card,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: RADIUS.md,
                  background: COLORS.orangeLight,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={feat.icon} size={20} color={COLORS.orange} />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: COLORS.textPrimary, fontSize: '12px', fontWeight: '600' }}>{feat.label}</p>
                <p style={{ color: COLORS.textMuted, fontSize: '11px' }}>{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Brand Strip */}
        <div
          style={{
            background: COLORS.white,
            borderRadius: RADIUS.lg,
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: SHADOWS.card,
            marginBottom: 16,
          }}
        >
          <img src={logo} alt="Salora Capital" style={{ height: 28, objectFit: 'contain' }} />
          <div style={{ width: 1, height: 30, background: COLORS.border }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: COLORS.textMuted, fontSize: '11px' }}>LSP Partner:</span>
            <img src={bp} alt="BetterPlace" style={{ height: 20, objectFit: 'contain' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
