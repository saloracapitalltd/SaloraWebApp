import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Icon, StatusBadge } from '../components/index.jsx';
import { COLORS, FONT_SIZES, SPACING, RADIUS, SHADOWS } from '../utils/theme.js';
import { formatAmount, formatDate } from '../utils/api.js';
import logo from '../logo.png';

export default function CustomerScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loan, input, inputType } = location.state || {};

  if (!loan) {
    navigate('/');
    return null;
  }

  const overdueEmis = loan.emis.filter(e => e.status === 'overdue');
  const pendingEmis = loan.emis.filter(e => e.status === 'due' || e.status === 'overdue');

  const handlePayFull = () => {
    navigate('/payment', {
      state: {
        loan,
        paymentType: 'full',
        amount: loan.outstandingAmount,
        principal: loan.outstandingPrincipal,
        interest: loan.outstandingInterest,
        charges: loan.outstandingCharges,
      },
    });
  };

  const handleEmiClick = (emi) => {
    if (emi.status === 'paid') return;
    navigate('/payment', {
      state: {
        loan,
        emi,
        paymentType: 'emi',
        amount: emi.totalAmount - emi.paidAmount > 0 ? emi.totalAmount - emi.paidAmount : emi.totalAmount,
        principal: emi.principalAmount,
        interest: emi.interestAmount,
        charges: emi.chargesAmount,
      },
    });
  };

  const progressPercent = loan.totalEmis > 0 ? (loan.paidEmis / loan.totalEmis) * 100 : 0;

  return (
    <div style={{ background: COLORS.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

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

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 24px' }}>

        {/* Outstanding Card */}
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
          {/* Decorative */}
          <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(240,90,40,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -30, left: '30%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Loan Code + Status */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>
                  Loan Account
                </p>
                <p style={{ color: COLORS.white, fontSize: '15px', fontWeight: '700' }}>{loan.loanCode}</p>
              </div>
              <span
                style={{
                  background: COLORS.successLight,
                  color: COLORS.success,
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '4px 12px',
                  borderRadius: RADIUS.full,
                }}
              >
                {loan.loanStatus || 'Active'}
              </span>
            </div>

            {/* Mobile/PAN */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 18 }}>
              <Icon
                name={inputType === 'mobile' ? 'cellphone' : 'card-account-details-outline'}
                size={13}
                color="rgba(255,255,255,0.5)"
              />
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                {inputType === 'mobile' ? `+91 ${input}` : input}
              </span>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.12)', marginBottom: 16 }} />

            {/* Outstanding Amount */}
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
              Total Outstanding Amount
            </p>
            <p style={{ color: COLORS.orange, fontSize: '38px', fontWeight: '800', lineHeight: 1.1, marginBottom: 14 }}>
              {formatAmount(loan.outstandingAmount)}
            </p>

            {/* Breakdown Pills */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {[
                { label: 'Principal', amount: loan.outstandingPrincipal },
                { label: 'Interest', amount: loan.outstandingInterest },
                { label: 'Charges', amount: loan.outstandingCharges },
              ].map(item => (
                <div
                  key={item.label}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: RADIUS.sm,
                    padding: '5px 10px',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '10px', fontWeight: '600' }}>{item.label}</p>
                  <p style={{ color: COLORS.white, fontSize: '12px', fontWeight: '700' }}>{formatAmount(item.amount)}</p>
                </div>
              ))}
            </div>

            {/* Pay Full Button */}
            {loan.outstandingAmount > 0 && (
              <button
                onClick={handlePayFull}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  background: `linear-gradient(135deg, ${COLORS.orange}, ${COLORS.orangeDark})`,
                  borderRadius: RADIUS.md,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(240,90,40,0.4)',
                  marginBottom: 14,
                }}
              >
                <Icon name="lightning-bolt" size={16} color={COLORS.white} />
                <span style={{ color: COLORS.white, fontWeight: '700', fontSize: '14px' }}>
                  Pay Full Outstanding {formatAmount(loan.outstandingAmount)}
                </span>
              </button>
            )}

            {/* Progress */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>EMI Progress</span>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px', fontWeight: '600' }}>
                  {loan.paidEmis} of {loan.totalEmis} paid
                </span>
              </div>
              <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 3, overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${progressPercent}%`,
                    background: COLORS.orange,
                    borderRadius: 3,
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Overdue Alert */}
        {overdueEmis.length > 0 && (
          <div
            style={{
              background: COLORS.dangerLight,
              border: `1px solid ${COLORS.danger}30`,
              borderRadius: RADIUS.md,
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <Icon name="alert-circle" size={20} color={COLORS.danger} style={{ marginTop: 1 }} />
            <div>
              <p style={{ color: COLORS.danger, fontWeight: '700', fontSize: '13px', marginBottom: 2 }}>
                {overdueEmis.length} Overdue EMI{overdueEmis.length > 1 ? 's' : ''}
              </p>
              <p style={{ color: '#B91C1C', fontSize: '12px', lineHeight: 1.4 }}>
                You have overdue EMIs. Please pay immediately to avoid additional charges.
              </p>
            </div>
          </div>
        )}

        {/* EMI Schedule */}
        <div style={{ background: COLORS.white, borderRadius: RADIUS.lg, boxShadow: SHADOWS.card, overflow: 'hidden', marginBottom: 24 }}>
          {/* Section Header */}
          <div
            style={{
              padding: '14px 16px',
              borderBottom: `1px solid ${COLORS.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Icon name="calendar-month-outline" size={18} color={COLORS.primary} />
              <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '15px' }}>EMI Schedule</span>
            </div>
            {pendingEmis.length > 0 && (
              <span
                style={{
                  background: COLORS.dangerLight,
                  color: COLORS.danger,
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: RADIUS.full,
                }}
              >
                {pendingEmis.length} Pending
              </span>
            )}
          </div>

          {/* EMI List */}
          {loan.emis.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center' }}>
              <Icon name="calendar-blank-outline" size={40} color={COLORS.textMuted} style={{ marginBottom: 10 }} />
              <p style={{ color: COLORS.textMuted, fontSize: '14px' }}>No EMI schedule available</p>
            </div>
          ) : (
            loan.emis.map((emi, idx) => {
              const isPaid = emi.status === 'paid';
              const isOverdue = emi.status === 'overdue';
              const statusColor = isPaid ? COLORS.success : isOverdue ? COLORS.danger : COLORS.warning;

              return (
                <div
                  key={emi.id || idx}
                  onClick={() => handleEmiClick(emi)}
                  style={{
                    padding: '13px 16px',
                    borderBottom: idx < loan.emis.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    cursor: isPaid ? 'default' : 'pointer',
                    background: isPaid ? 'transparent' : (isOverdue ? '#FFF5F5' : 'transparent'),
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!isPaid) e.currentTarget.style.background = COLORS.borderLight; }}
                  onMouseLeave={e => { if (!isPaid) e.currentTarget.style.background = isPaid ? 'transparent' : (isOverdue ? '#FFF5F5' : 'transparent'); }}
                >
                  {/* Status Icon */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: isPaid ? COLORS.successLight : isOverdue ? COLORS.dangerLight : COLORS.warningLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      name={isPaid ? 'check-circle' : isOverdue ? 'alert-circle' : 'clock-outline'}
                      size={17}
                      color={statusColor}
                    />
                  </div>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                      <span style={{ color: COLORS.textPrimary, fontWeight: '600', fontSize: '13px' }}>
                        EMI #{emi.emiNumber}
                      </span>
                      <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '13px' }}>
                        {formatAmount(emi.totalAmount)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: COLORS.textMuted, fontSize: '11px' }}>
                        Due: {formatDate(emi.dueDate)}
                        {emi.dpd > 0 && (
                          <span style={{ color: COLORS.danger, fontWeight: '600', marginLeft: 6 }}>
                            DPD: {emi.dpd}
                          </span>
                        )}
                      </span>
                      <StatusBadge status={emi.status} />
                    </div>
                  </div>

                  {/* Chevron */}
                  {!isPaid && (
                    <Icon name="chevron-right" size={18} color={COLORS.textMuted} style={{ flexShrink: 0 }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
