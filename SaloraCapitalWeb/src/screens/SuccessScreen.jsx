import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, useToast } from '../components/index.jsx';
import { COLORS, RADIUS, SHADOWS } from '../utils/theme.js';
import { formatAmount } from '../utils/api.js';
import logo from '../logo.png';

export default function SuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loan, emi, paymentType, amount, paymentLink, txnId } = location.state || {};
  const toast = useToast();

  const [animIn, setAnimIn] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimIn(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!loan) {
    navigate('/');
    return null;
  }

  const isFullPayment = paymentType === 'full';
  const paymentFor = isFullPayment ? 'Full Outstanding' : `EMI #${emi?.emiNumber}`;

  const handleOpenLink = () => {
    if (paymentLink) window.open(paymentLink, '_blank');
    else toast.error('Payment link not available.');
  };

  const handleShare = async () => {
    const text = `Salora Capital EMI Payment\nLoan: ${loan.loanCode}\nAmount: ${formatAmount(amount)}\nRef: ${txnId || 'N/A'}\nPay here: ${paymentLink || ''}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Salora Capital Payment', text });
      } catch {
        handleCopy(text);
      }
    } else {
      handleCopy(text);
    }
  };

  const handleCopy = (text) => {
    const t = text || (paymentLink || '');
    navigator.clipboard.writeText(t).then(() => {
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2500);
    }).catch(() => {
      toast.info('Link: ' + (paymentLink || 'N/A'));
    });
  };

  return (
    <div style={{ background: COLORS.background, minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '24px 16px 40px' }}>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0) rotate(-180deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(10deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes fadeSlideUp {
          0% { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Success Icon */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28, marginTop: 16 }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: COLORS.successLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            animation: animIn ? 'scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards' : 'none',
            opacity: animIn ? 1 : 0,
            border: `4px solid ${COLORS.success}30`,
          }}
        >
          <Icon name="check-circle" size={52} color={COLORS.success} />
        </div>
        <div
          style={{
            animation: animIn ? 'fadeSlideUp 0.5s ease 0.3s both' : 'none',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: COLORS.textPrimary, fontSize: '24px', fontWeight: '800', marginBottom: 6 }}>
            Payment Initiated!
          </h1>
          <p style={{ color: COLORS.textSecondary, fontSize: '14px', lineHeight: 1.5 }}>
            Complete your payment on the secure gateway.{'\n'}A confirmation will be sent to your mobile.
          </p>
        </div>
      </div>

      {/* Amount Card (Navy) */}
      <div
        style={{
          background: `linear-gradient(145deg, ${COLORS.primary}, ${COLORS.primaryLight})`,
          borderRadius: RADIUS.xl,
          padding: 20,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 6px 24px rgba(10,31,68,0.25)',
          animation: animIn ? 'fadeSlideUp 0.5s ease 0.4s both' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: -20, right: -20, width: 90, height: 90, borderRadius: '50%', background: 'rgba(240,90,40,0.12)' }} />
        <img src={logo} alt="Salora Capital" style={{ height: 28, objectFit: 'contain' }} />
        <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', marginBottom: 4 }}>Amount</p>
          <p style={{ color: COLORS.orange, fontSize: '28px', fontWeight: '800' }}>{formatAmount(amount)}</p>
        </div>
      </div>

      {/* Receipt Card */}
      <div
        style={{
          background: COLORS.white,
          borderRadius: RADIUS.lg,
          boxShadow: SHADOWS.card,
          padding: 18,
          marginBottom: 24,
          animation: animIn ? 'fadeSlideUp 0.5s ease 0.5s both' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Icon name="receipt" size={18} color={COLORS.primary} />
          <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '15px' }}>Payment Receipt</span>
        </div>

        {[
          { label: 'Loan Account', value: loan.loanCode },
          { label: 'Payment For', value: paymentFor },
          { label: 'Reference ID', value: txnId || 'Pending' },
        ].map((row, idx) => (
          <div
            key={row.label}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: idx < 2 ? `1px solid ${COLORS.border}` : 'none',
            }}
          >
            <span style={{ color: COLORS.textSecondary, fontSize: '13px' }}>{row.label}</span>
            <span style={{ color: COLORS.textPrimary, fontWeight: '600', fontSize: '13px', maxWidth: 160, textAlign: 'right', wordBreak: 'break-all' }}>
              {row.value}
            </span>
          </div>
        ))}

        {/* Amount row styled specially */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 12,
            marginTop: 4,
            borderTop: `2px solid ${COLORS.border}`,
          }}
        >
          <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '14px' }}>Amount</span>
          <span style={{ color: COLORS.orange, fontWeight: '800', fontSize: '18px' }}>{formatAmount(amount)}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          animation: animIn ? 'fadeSlideUp 0.5s ease 0.6s both' : 'none',
        }}
      >
        {/* Open Payment Link */}
        <button
          onClick={handleOpenLink}
          style={{
            width: '100%',
            padding: '14px 0',
            background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`,
            borderRadius: RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(240,90,40,0.35)',
          }}
        >
          <Icon name="open-in-new" size={18} color={COLORS.white} />
          <span style={{ color: COLORS.white, fontWeight: '700', fontSize: '15px' }}>Open Payment Link</span>
        </button>

        {/* Share Link */}
        <button
          onClick={handleShare}
          style={{
            width: '100%',
            padding: '14px 0',
            background: COLORS.white,
            borderRadius: RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            border: `1.5px solid ${COLORS.border}`,
            cursor: 'pointer',
            boxShadow: SHADOWS.card,
          }}
        >
          <Icon name={copied ? 'check' : 'share-variant'} size={18} color={copied ? COLORS.success : COLORS.primary} />
          <span style={{ color: copied ? COLORS.success : COLORS.textPrimary, fontWeight: '600', fontSize: '15px' }}>
            {copied ? 'Copied!' : 'Share Link'}
          </span>
        </button>

        {/* Go to Home */}
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '14px 0',
            background: COLORS.primary,
            borderRadius: RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Icon name="home" size={18} color={COLORS.white} />
          <span style={{ color: COLORS.white, fontWeight: '600', fontSize: '15px' }}>Go to Home</span>
        </button>
      </div>
    </div>
  );
}
