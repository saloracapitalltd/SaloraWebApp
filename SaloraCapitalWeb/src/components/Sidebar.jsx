import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileCheck,
  Terminal,
  History,
  TrendingUp,
  Shield,
  ChevronRight,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/consent', icon: FileCheck, label: 'Consent Viewer' },
  { to: '/api-tester', icon: Terminal, label: 'API Tester' },
  { to: '/history', icon: History, label: 'Transaction History' },
];

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.logo}>
          <TrendingUp size={20} />
        </div>
        <div>
          <div className={styles.brandName}>Salora Capital</div>
          <div className={styles.brandSub}>Account Aggregator</div>
        </div>
      </div>

      <nav className={styles.nav}>
        <div className={styles.navLabel}>NAVIGATION</div>
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            <ChevronRight size={14} className={styles.chevron} />
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.footerCard}>
          <Shield size={16} className={styles.footerIcon} />
          <div>
            <div className={styles.footerTitle}>AA Framework</div>
            <div className={styles.footerSub}>RBI Compliant · v1.21.0</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
