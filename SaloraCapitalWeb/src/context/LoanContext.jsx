import React, { createContext, useContext, useState } from 'react';

const LoanContext = createContext(null);

export function LoanProvider({ children }) {
  const [loan, setLoan] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchInputType, setSearchInputType] = useState('mobile');

  const clearLoan = () => {
    setLoan(null);
    setSearchInput('');
    setSearchInputType('mobile');
  };

  return (
    <LoanContext.Provider value={{ loan, setLoan, searchInput, setSearchInput, searchInputType, setSearchInputType, clearLoan }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoan() {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error('useLoan must be used within a LoanProvider');
  return ctx;
}

export default LoanContext;
