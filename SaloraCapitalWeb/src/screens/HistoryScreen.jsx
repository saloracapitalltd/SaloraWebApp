import React, { useState } from 'react';
import { useLoan } from '../context/LoanContext.jsx';
import { Icon, StatusBadge, useToast } from '../components/index.jsx';
import { COLORS, RADIUS, SHADOWS } from '../utils/theme.js';
import { formatAmount, formatDate } from '../utils/api.js';
import logo from '../logo.png';

export default function HistoryScreen() {
  const { loan } = useLoan();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState('all');

  const allEmis = loan?.emis || [];
  const paidEmis = allEmis.filter(e => e.status === 'paid');
  const pendingEmis = allEmis.filter(e => e.status !== 'paid');

  const tabData = {
    all: allEmis,
    paid: paidEmis,
    pending: pendingEmis,
  };
  const displayEmis = tabData[activeTab] || [];

  const handleDownloadStatement = () => {
    if (!loan) {
      toast.warning('No loan data available. Please search for your loan first.');
      return;
    }
    const lines = [
      `Salora Capital — EMI Statement`,
      `Generated: ${new Date().toLocaleDateString('en-IN')}`,
      ``,
      `Loan Account: ${loan.loanCode}`,
      `Total EMIs: ${loan.totalEmis}`,
      `Paid EMIs: ${loan.paidEmis}`,
      `Pending EMIs: ${loan.pendingEmis}`,
      `Outstanding Amount: ${formatAmount(loan.outstandingAmount)}`,
      ``,
      `EMI Details:`,
      `---------------------------------------------------------------`,
      ...allEmis.map(e =>
        `EMI #${e.emiNumber} | Due: ${formatDate(e.dueDate)} | Amount: ${formatAmount(e.totalAmount)} | Status: ${e.status.toUpperCase()}${e.dpd > 0 ? ` | DPD: ${e.dpd}` : ''}`
      ),
      `---------------------------------------------------------------`,
    ];
    const content = lines.join('\n');

    if (navigator.share) {
      navigator.share({ title: 'EMI Statement', text: content }).catch(() => downloadAsFile(content));
    } else {
      downloadAsFile(content);
    }
  };

  const downloadAsFile = (content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMI_Statement_${loan?.loanCode || 'loan'}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ background: COLORS.background, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

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
        <h1 style={{ color: COLORS.white, fontSize: '18px', fontWeight: '700' }}>Payment History</h1>
        <button
          onClick={handleDownloadStatement}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: RADIUS.full,
            padding: '7px 13px',
            cursor: 'pointer',
          }}
        >
          <Icon name="download" size={15} color={COLORS.white} />
          <span style={{ color: COLORS.white, fontSize: '12px', fontWeight: '600' }}>Statement</span>
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px' }}>

        {!loan ? (
          /* Empty State */
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: COLORS.borderLight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}
            >
              <Icon name="receipt-text-outline" size={38} color={COLORS.textMuted} />
            </div>
            <h3 style={{ color: COLORS.textPrimary, fontSize: '17px', fontWeight: '700', marginBottom: 8 }}>
              No Payment History
            </h3>
            <p style={{ color: COLORS.textMuted, fontSize: '14px', textAlign: 'center', lineHeight: 1.5, maxWidth: 260 }}>
              Search for your loan on the Home screen to view your EMI payment history.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              {[
                { label: 'Total EMIs', value: loan.totalEmis, color: COLORS.primary, bg: '#EEF2FF' },
                { label: 'Paid', value: loan.paidEmis, color: COLORS.success, bg: COLORS.successLight },
                { label: 'Pending', value: loan.pendingEmis, color: COLORS.warning, bg: COLORS.warningLight },
              ].map(item => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    background: item.bg,
                    borderRadius: RADIUS.md,
                    padding: '12px 10px',
                    textAlign: 'center',
                    border: `1px solid ${item.color}20`,
                  }}
                >
                  <p style={{ color: item.color, fontSize: '22px', fontWeight: '800', lineHeight: 1 }}>{item.value}</p>
                  <p style={{ color: item.color, fontSize: '11px', fontWeight: '600', marginTop: 4, opacity: 0.8 }}>{item.label}</p>
                </div>
              ))}
            </div>

            {/* Loan Info */}
            <div
              style={{
                background: COLORS.white,
                borderRadius: RADIUS.md,
                padding: '12px 16px',
                marginBottom: 16,
                boxShadow: SHADOWS.card,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <p style={{ color: COLORS.textMuted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Loan Account</p>
                <p style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '14px' }}>{loan.loanCode}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ color: COLORS.textMuted, fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 }}>Outstanding</p>
                <p style={{ color: COLORS.orange, fontWeight: '700', fontSize: '14px' }}>{formatAmount(loan.outstandingAmount)}</p>
              </div>
            </div>

            {/* Tabs */}
            <div
              style={{
                display: 'flex',
                background: COLORS.white,
                borderRadius: RADIUS.md,
                padding: 3,
                marginBottom: 16,
                boxShadow: SHADOWS.card,
              }}
            >
              {[
                { key: 'all', label: `All (${allEmis.length})` },
                { key: 'paid', label: `Paid (${paidEmis.length})` },
                { key: 'pending', label: `Pending (${pendingEmis.length})` },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  style={{
                    flex: 1,
                    padding: '9px 0',
                    borderRadius: RADIUS.sm,
                    background: activeTab === tab.key ? COLORS.primary : 'transparent',
                    color: activeTab === tab.key ? COLORS.white : COLORS.textSecondary,
                    fontWeight: activeTab === tab.key ? '700' : '500',
                    fontSize: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* EMI List */}
            {displayEmis.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Icon name="check-all" size={40} color={COLORS.success} style={{ marginBottom: 12 }} />
                <p style={{ color: COLORS.textSecondary, fontSize: '14px' }}>
                  {activeTab === 'paid' ? 'No paid EMIs yet.' : 'No pending EMIs. All clear!'}
                </p>
              </div>
            ) : (
              <div style={{ background: COLORS.white, borderRadius: RADIUS.lg, boxShadow: SHADOWS.card, overflow: 'hidden' }}>
                {displayEmis.map((emi, idx) => {
                  const isPaid = emi.status === 'paid';
                  const isOverdue = emi.status === 'overdue';
                  const statusColor = isPaid ? COLORS.success : isOverdue ? COLORS.danger : COLORS.warning;

                  return (
                    <div
                      key={emi.id || idx}
                      style={{
                        padding: '13px 16px',
                        borderBottom: idx < displayEmis.length - 1 ? `1px solid ${COLORS.border}` : 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}
                    >
                      {/* Status Dot */}
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

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ color: COLORS.textPrimary, fontWeight: '600', fontSize: '13px' }}>
                            EMI #{emi.emiNumber}
                          </span>
                          <span style={{ color: COLORS.textPrimary, fontWeight: '700', fontSize: '13px' }}>
                            {formatAmount(emi.totalAmount)}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: COLORS.textMuted, fontSize: '11px' }}>
                            {formatDate(emi.dueDate)}
                            {emi.dpd > 0 && (
                              <span style={{ color: COLORS.danger, fontWeight: '600', marginLeft: 6 }}>DPD: {emi.dpd}</span>
                            )}
                          </span>
                          <StatusBadge status={emi.status} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
