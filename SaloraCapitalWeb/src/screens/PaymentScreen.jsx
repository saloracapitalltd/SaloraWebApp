import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, LoadingOverlay, useToast } from '../components/index.jsx';
import { COLORS, RADIUS, SHADOWS } from '../utils/theme.js';
import { formatAmount, formatDate, createPaymentLink } from '../utils/api.js';
import logo from '../logo.png';

export default function PaymentScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loan, emi, paymentType, amount, principal, interest, charges } = location.state || {};
  const toast = useToast();

  const [loading, setLoading] = useState(false);

  if (!loan) {
    navigate('/');
    return null;
  }

  const isFullPayment = paymentType === 'full';
  const displayAmount = amount || 0;

  const handlePay = async () => {
    if (!loan.customerId) {
      toast.error('Customer ID not available. Please go back and try again.');
      return;
    }
    setLoading(true);
    try {
      const { link, txnId } = await createPaymentLink(loan.customerId, displayAmount);
      window.open(link, '_blank');
      navigate('/success', {
        state: {
          loan,
          emi,
          paymentType,
          amount: displayAmount,
          paymentLink: link,
          txnId,
        },
      });
    } catch (err) {
      toast.error(err.message || 'Failed to generate payment link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: COLORS.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <LoadingOverlay visible={loading} message="Generating payment link..." />

      {/* Header */}
      <div
        style={{
          background: COLORS.primary,
          padding: '16px 20px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            width: 36,
            height: 36,
            borderRadius: RADIUS.md,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Icon name="arrow-left" size={20} color={COLORS.white} />
        </button>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <img src={logo} alt="Salora Capital" style={{ height: 30, objectFit: 'contain' }} />
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 32px' }}>

        {/* Summary Card (Navy) */}
        <div
          style={{
            background: `linear-gradient(145deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
            borderRadius: RADIUS.xl,
            padding: 20,
            marginBottom: 16,
            boxShadow: '0 6px 24px rgba(10,31,68,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(240,90,40,0.1)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Loan Account + Tag */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  Loan Account
                </p>
                <p style={{ color: COLORS.white, fontWeight: '700', fontSize: '15px' }}>{loan.loanCode}</p>
              </div>
              <span
                style={{
                  background: isFullPayment ? COLORS.orangeLight : COLORS.warningLight,
                  color: isFullPayment ? COLORS.orange : COLORS.warning,
                  fontSize: '11px',
                  fontWeight: '700',
                  padding: '4px 11px',
                  borderRadius: RADIUS.full,
                }}
              >
                {isFullPayment ? 'Full Outstanding' : `EMI #${emi?.emiNumber}`}
              </span>
            </div>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 16 }} />

            {/* Amount */}
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', marginBottom: 4 }}>Amount to Pay</p>
            <p style={{ color: COLORS.orange, fontSize: '42px', fontWeight: '800', lineHeight: 1.1, marginBottom: 14 }}>
              {formatAmount(displayAmount)}
            </p>

            {/* Due Date or All Dues */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="calendar-clock" size={14} color="rgba(255,255,255,0.5)" />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                {isFullPayment ? 'All Pending Dues' : `Due: ${formatDate(emi?.dueDate)}`}
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown Card */}
        <div
          style={{
            background: COLORS.white,
            borderRadius: RADIUS.lg,
            boxShadow: SHADOWS.card,
            padding: 18,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Icon name="format-list-bulleted" size={18} color={COLORS.primary} />
            <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '15px' }}>Payment Breakdown</span>
          </div>

          {[
            { label: 'Principal', amount: principal || 0, color: COLORS.textPrimary },
            { label: 'Interest', amount: interest || 0, color: COLORS.textSecondary },
            { label: 'Charges / Penalty', amount: charges || 0, color: COLORS.warning },
          ].map((item, idx) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: idx < 2 ? `1px solid ${COLORS.border}` : 'none',
              }}
            >
              <span style={{ color: COLORS.textSecondary, fontSize: '14px' }}>{item.label}</span>
              <span style={{ color: item.color, fontWeight: '600', fontSize: '14px' }}>{formatAmount(item.amount)}</span>
            </div>
          ))}

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 12,
              paddingTop: 12,
              borderTop: `2px solid ${COLORS.border}`,
            }}
          >
            <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '15px' }}>Total</span>
            <span style={{ color: COLORS.orange, fontWeight: '800', fontSize: '17px' }}>{formatAmount(displayAmount)}</span>
          </div>
        </div>

        {/* Info Box */}
        <div
          style={{
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            borderRadius: RADIUS.md,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 24,
          }}
        >
          <Icon name="information" size={18} color="#3B82F6" style={{ marginTop: 1, flexShrink: 0 }} />
          <p style={{ color: '#1D4ED8', fontSize: '12px', lineHeight: 1.6 }}>
            You will be redirected to our secure payment gateway. After successful payment, a confirmation will be sent to your registered mobile number.
          </p>
        </div>

        {/* Pay Button */}
        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px 0',
            background: loading ? COLORS.textMuted : `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`,
            borderRadius: RADIUS.md,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 20px rgba(240,90,40,0.4)',
            transition: 'all 0.2s',
          }}
        >
          <Icon name="lock" size={18} color={COLORS.white} />
          <span style={{ color: COLORS.white, fontWeight: '700', fontSize: '16px' }}>
            Pay {formatAmount(displayAmount)} Securely
          </span>
        </button>

        <p style={{ textAlign: 'center', color: COLORS.textMuted, fontSize: '11px', marginTop: 12 }}>
          256-bit SSL encrypted • PCI DSS compliant
        </p>
      </div>
    </div>
  );
}
