import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { LoanProvider } from './context/LoanContext.jsx';
import { Icon, ToastProvider } from './components/index.jsx';
import { COLORS } from './utils/theme.js';
import HomeScreen from './screens/HomeScreen.jsx';
import CustomerScreen from './screens/CustomerScreen.jsx';
import PaymentScreen from './screens/PaymentScreen.jsx';
import SuccessScreen from './screens/SuccessScreen.jsx';
import HistoryScreen from './screens/HistoryScreen.jsx';
import ProfileScreen from './screens/ProfileScreen.jsx';

const BOTTOM_NAV_ROUTES = ['/', '/history', '/profile'];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname;

  if (!BOTTOM_NAV_ROUTES.includes(path)) return null;

  const tabs = [
    { path: '/', label: 'Home', iconActive: 'home', iconInactive: 'home-outline' },
    { path: '/history', label: 'Payments', iconActive: 'receipt-text', iconInactive: 'receipt-text-outline' },
    { path: '/profile', label: 'Profile', iconActive: 'account-circle', iconInactive: 'account-circle-outline' },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 430,
        height: 60,
        background: COLORS.white,
        borderTop: `1px solid ${COLORS.border}`,
        display: 'flex',
        alignItems: 'stretch',
        zIndex: 1000,
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
      }}
    >
      {tabs.map(tab => {
        const isActive = path === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 0',
              position: 'relative',
            }}
          >
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 32,
                  height: 3,
                  background: COLORS.orange,
                  borderRadius: '0 0 3px 3px',
                }}
              />
            )}
            <Icon
              name={isActive ? tab.iconActive : tab.iconInactive}
              size={22}
              color={isActive ? COLORS.orange : COLORS.textMuted}
            />
            <span
              style={{
                fontSize: '11px',
                fontWeight: isActive ? '600' : '400',
                color: isActive ? COLORS.orange : COLORS.textMuted,
                lineHeight: 1,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AppShell() {
  return (
    <div
      style={{
        maxWidth: 430,
        minHeight: '100vh',
        margin: '0 auto',
        background: COLORS.background,
        position: 'relative',
        boxShadow: '0 0 40px rgba(0,0,0,0.12)',
        overflowX: 'hidden',
      }}
    >
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/customer" element={<CustomerScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/success" element={<SuccessScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <LoanProvider>
        <BrowserRouter>
          <AppShell />
        </BrowserRouter>
      </LoanProvider>
    </ToastProvider>
  );
}
