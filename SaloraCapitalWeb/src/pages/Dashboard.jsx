import { useState } from 'react';
import { AlertCircle, CheckCircle, Activity, Clock, Database, TrendingUp, RefreshCw } from 'lucide-react';
import PageHeader from '../components/PageHeader.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { formatTimestamp, MOCK_RESPONSE, MOCK_SUCCESS_RESPONSE, ERROR_CODE_MAP, copyToClipboard } from '../utils/format.js';
import toast from 'react-hot-toast';
import styles from './Dashboard.module.css';

const STAT_CARDS = [
  { label: 'Total Requests', value: '1,248', icon: Activity, trend: '+12%', color: 'blue' },
  { label: 'Successful', value: '1,102', icon: CheckCircle, trend: '+8%', color: 'green' },
  { label: 'Failed', value: '146', icon: AlertCircle, trend: '-3%', color: 'red' },
  { label: 'Avg Response', value: '312ms', icon: Clock, trend: '-18ms', color: 'purple' },
];

export default function Dashboard() {
  const [response] = useState(MOCK_RESPONSE);
  const [loading, setLoading] = useState(false);

  function handleRefresh() {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Dashboard refreshed');
    }, 1200);
  }

  const isError = !response.status;
  const errorDesc = ERROR_CODE_MAP[response.errorCode] || 'Unknown error occurred.';

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Account Aggregator — Live API Overview"
        actions={
          <button className={styles.refreshBtn} onClick={handleRefresh} disabled={loading}>
            <RefreshCw size={15} className={loading ? styles.spin : ''} />
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        }
      />

      <div className={styles.content}>
        {/* Stat Cards */}
        <div className={styles.statsGrid}>
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`${styles.statCard} ${styles[card.color]}`}>
                <div className={styles.statTop}>
                  <div className={styles.statLabel}>{card.label}</div>
                  <div className={`${styles.statIcon} ${styles[`icon_${card.color}`]}`}>
                    <Icon size={18} />
                  </div>
                </div>
                <div className={styles.statValue}>{card.value}</div>
                <div className={styles.statTrend}>{card.trend} from last week</div>
              </div>
            );
          })}
        </div>

        {/* Latest API Response */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Latest API Response</div>
          <div className={`${styles.responseCard} ${isError ? styles.responseError : styles.responseSuccess}`}>
            <div className={styles.responseHeader}>
              <div className={styles.responseHeaderLeft}>
                {isError
                  ? <AlertCircle size={20} className={styles.errIcon} />
                  : <CheckCircle size={20} className={styles.successIcon} />}
                <div>
                  <div className={styles.responseTitle}>
                    {isError ? response.errorCode : 'Success'}
                  </div>
                  <div className={styles.responseSubtitle}>
                    {isError ? response.errorMsg : 'Data fetched successfully'}
                  </div>
                </div>
              </div>
              <StatusBadge status={isError ? 'error' : 'success'} size="lg" />
            </div>

            <div className={styles.metaGrid}>
              <MetaItem label="Version" value={`v${response.ver}`} />
              <MetaItem label="Status" value={response.status ? 'true' : 'false'} mono />
              <MetaItem label="Error Code" value={response.errorCode || '—'} mono />
              <MetaItem label="Data Records" value={response.data?.length ?? 0} />
              <MetaItem label="Timestamp" value={formatTimestamp(response.timestamp)} />
              <MetaItem
                label="Transaction ID"
                value={response.txnid}
                mono
                copy
                onCopy={() => {
                  copyToClipboard(response.txnid);
                  toast.success('Transaction ID copied!');
                }}
              />
            </div>

            {isError && (
              <div className={styles.errorDesc}>
                <AlertCircle size={14} />
                <span>{errorDesc}</span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>Recent Transactions</div>
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Timestamp</th>
                  <th>Version</th>
                  <th>Records</th>
                  <th>Status</th>
                  <th>Error</th>
                </tr>
              </thead>
              <tbody>
                {[MOCK_RESPONSE, MOCK_SUCCESS_RESPONSE, MOCK_RESPONSE, MOCK_SUCCESS_RESPONSE].map((r, i) => (
                  <tr key={i}>
                    <td className={styles.txnCell}>{r.txnid.slice(0, 18)}…</td>
                    <td>{formatTimestamp(r.timestamp)}</td>
                    <td>v{r.ver}</td>
                    <td>{r.data?.length ?? 0}</td>
                    <td><StatusBadge status={r.status ? 'success' : 'error'} size="sm" /></td>
                    <td className={styles.errCell}>{r.errorCode || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ label, value, mono, copy, onCopy }) {
  return (
    <div className={styles.metaItem}>
      <div className={styles.metaLabel}>{label}</div>
      <div className={`${styles.metaValue} ${mono ? styles.mono : ''}`}>
        {String(value)}
        {copy && (
          <button className={styles.copyBtn} onClick={onCopy} title="Copy">
            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
