import styles from './StatusBadge.module.css';

const VARIANTS = {
  success: { label: 'Success', cls: 'success' },
  error: { label: 'Failed', cls: 'error' },
  pending: { label: 'Pending', cls: 'pending' },
  warning: { label: 'Warning', cls: 'warning' },
  active: { label: 'Active', cls: 'success' },
  inactive: { label: 'Inactive', cls: 'error' },
};

export default function StatusBadge({ status, label, size = 'md' }) {
  const variant = VARIANTS[status] || VARIANTS.pending;
  const displayLabel = label || variant.label;

  return (
    <span className={`${styles.badge} ${styles[variant.cls]} ${styles[size]}`}>
      <span className={styles.dot} />
      {displayLabel}
    </span>
  );
}
