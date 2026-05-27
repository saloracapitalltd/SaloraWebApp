const BASE_URL = 'https://lspapi.saloracapital.com/api';

// Open (no-auth) endpoints:
//   GET /api/emi/schedule?loanId=                                       -> EMI schedule by loanId
//   GET /api/emi/schedule/lookup?mobileNumber=|panNumber=|applicationId=
//                                                                       -> EMI schedule by mobile / PAN / applicationId
//   GET /api/payin/createLink?customerId=&amount=&flags=                 -> Razorpay payment link
// Note: the lookup endpoint expects `panNumber` (NOT `pan`) and does NOT accept `loanId`.
const headers = () => ({ 'Content-Type': 'application/json' });

const mapStatus = (emiStatus, dpd) => {
  const s = (emiStatus || '').toLowerCase();
  if (s === 'paid') return 'paid';
  if (s === 'writtenoff' || s === 'written_off' || dpd > 0) return 'overdue';
  return 'due';
};

const friendlyError = (apiMsg, status, inputType) => {
  if (status === 403) {
    return 'Access denied by server (403). Please contact support.';
  }
  if (!apiMsg) return 'Something went wrong. Please try again.';
  const msg = apiMsg.toLowerCase();
  if (msg.includes('not found') || msg.includes('no record') || msg.includes('no loan') || msg.includes('customer not found') || msg.includes('invalid applicationid') || msg.includes('must not be null') || msg.includes('at least one of')) {
    if (inputType === 'mobile') return 'No loan found for this mobile number. Please check and try again.';
    if (inputType === 'pan') return 'No loan found for this PAN. Please check and try again.';
    if (inputType === 'applicationId') return 'No loan found for this Application ID. Please check and try again.';
    if (inputType === 'loanId') return 'No loan found for this Loan ID. Please check and try again.';
    return 'No loan record found. Please verify your details.';
  }
  if (msg.includes('invalid') || msg.includes('incorrect')) {
    if (inputType === 'mobile') return 'Invalid mobile number. Please enter a valid 10-digit number.';
    if (inputType === 'pan') return 'Invalid PAN format. Please enter a valid PAN (e.g. ABCDE1234F).';
    return 'Invalid input. Please check your details and try again.';
  }
  if (msg.includes('network') || msg.includes('timeout') || msg.includes('connect')) {
    return 'Network error. Please check your internet connection and try again.';
  }
  return apiMsg || 'Something went wrong. Please try again.';
};

export const fetchLoanSchedule = async ({ mobile, pan, applicationId, loanId }) => {
  try {
    let url = '';
    let inputType = '';

    if (mobile) {
      url = `${BASE_URL}/emi/schedule/lookup?mobileNumber=${encodeURIComponent(mobile)}`;
      inputType = 'mobile';
    } else if (pan) {
      url = `${BASE_URL}/emi/schedule/lookup?panNumber=${encodeURIComponent(pan.toUpperCase())}`;
      inputType = 'pan';
    } else if (loanId) {
      url = `${BASE_URL}/emi/schedule?loanId=${encodeURIComponent(loanId)}`;
      inputType = 'loanId';
    } else if (applicationId) {
      url = `${BASE_URL}/emi/schedule/lookup?applicationId=${encodeURIComponent(applicationId)}`;
      inputType = 'applicationId';
    } else {
      throw new Error('Please provide mobile number or PAN to search.');
    }

    const response = await fetch(url, { method: 'GET', headers: headers() });
    let data = null;
    try { data = await response.json(); } catch { data = null; }

    if (!response.ok) {
      const errMsg = data?.error?.message || data?.message || data?.error || `Request failed with status ${response.status}`;
      throw new Error(friendlyError(errMsg, response.status, inputType));
    }

    if (!data || (!data.emis && !data.loanDetails && !data.emiSchedule && !Array.isArray(data))) {
      throw new Error(friendlyError('No loan record found.', 200, inputType));
    }

    // Response shape from /api/emi/schedule:
    // { loanId, customerId, outstandingAmount, outstandingPrincipal, outstandingInterest, overallCharge,
    //   emis: [{ id, emiNumber, emiDate, emiAmount, principal, interest, emiStatus, dpd,
    //            charge, bounceCharge, overdueCharge, latePenaltyCharge,
    //            principleDue, interestDue, pendingEmiAmount, totalPayable }] }
    const loanDetails = data.loanDetails || data;
    const rawEmis = data.emis || data.emiSchedule || data.schedule || [];

    const emis = rawEmis.map((emi, idx) => {
      const dpd = Number(emi.dpd || emi.DPD || 0);
      const status = mapStatus(emi.emiStatus || emi.status || emi.EMIStatus, dpd);
      const emiAmount = Number(emi.emiAmount || emi.totalAmount || emi.amount || 0);
      const pendingAmount = Number(emi.pendingEmiAmount || 0);
      const charges =
        Number(emi.charge || 0) +
        Number(emi.bounceCharge || 0) +
        Number(emi.overdueCharge || 0) +
        Number(emi.latePenaltyCharge || 0);
      const paidAmount = status === 'paid'
        ? emiAmount
        : Math.max(0, emiAmount - pendingAmount);
      return {
        id: emi.id || emi.emiId || String(idx + 1),
        emiNumber: emi.emiNumber || emi.EMINumber || emi.installmentNumber || idx + 1,
        dueDate: emi.emiDate || emi.dueDate || emi.DueDate || emi.due_date || '',
        principalAmount: Number(emi.principal || emi.principalAmount || emi.principleDue || 0),
        interestAmount: Number(emi.interest || emi.interestAmount || emi.interestDue || 0),
        chargesAmount: charges || Number(emi.chargesAmount || emi.charges || emi.penaltyAmount || 0),
        totalAmount: Number(emi.totalPayable || emi.totalAmount || emi.emiAmount || emi.amount || 0),
        paidAmount: Number(emi.paidAmount || emi.amountPaid || paidAmount),
        status,
        dpd,
        emiStatus: emi.emiStatus || emi.status || emi.EMIStatus || '',
      };
    });

    const totalEmis = emis.length;
    const paidEmis = emis.filter(e => e.status === 'paid').length;
    const overdueEmis = emis.filter(e => e.status === 'overdue');
    const dueEmis = emis.filter(e => e.status === 'due' || e.status === 'overdue');

    const computedOutstanding = dueEmis.reduce((sum, e) => {
      const remaining = e.totalAmount - e.paidAmount;
      return sum + (remaining > 0 ? remaining : e.totalAmount);
    }, 0);
    const computedPrincipal = dueEmis.reduce((sum, e) => sum + e.principalAmount, 0);
    const computedInterest = dueEmis.reduce((sum, e) => sum + e.interestAmount, 0);
    const computedCharges = dueEmis.reduce((sum, e) => sum + e.chargesAmount, 0);

    const outstandingAmount = Number(loanDetails.outstandingAmount ?? computedOutstanding);
    const outstandingPrincipal = Number(loanDetails.outstandingPrincipal ?? computedPrincipal);
    const outstandingInterest = Number(loanDetails.outstandingInterest ?? computedInterest);
    const outstandingCharges = Number(loanDetails.overallCharge ?? loanDetails.outstandingCharges ?? computedCharges);

    const loan = {
      loanCode: loanDetails.loanCode || loanDetails.loanId || loanDetails.applicationId || loanDetails.LoanCode || 'N/A',
      customerName: loanDetails.customerName || loanDetails.name || loanDetails.borrowerName || '',
      mobileNumber: loanDetails.mobileNumber || loanDetails.mobile || mobile || '',
      pan: loanDetails.pan || loanDetails.PAN || pan || '',
      loanAmount: Number(loanDetails.loanAmount || loanDetails.sanctionedAmount || 0),
      loanStatus: loanDetails.loanStatus || loanDetails.status || (outstandingAmount > 0 ? 'Active' : 'Closed'),
      customerId: loanDetails.customerId || loanDetails.CustomerID || loanDetails.borrowerId || '',
      emis,
      totalEmis,
      paidEmis,
      pendingEmis: totalEmis - paidEmis,
      overdueEmis,
      outstandingAmount,
      outstandingPrincipal,
      outstandingInterest,
      outstandingCharges,
      inputType,
    };

    return loan;
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw err;
  }
};

export const createPaymentLink = async (customerId, amount) => {
  try {
    const url = `${BASE_URL}/payin/createLink?customerId=${encodeURIComponent(customerId)}&amount=${encodeURIComponent(amount)}&flags=5`;
    const response = await fetch(url, { method: 'GET', headers: headers() });
    const data = await response.json();

    if (!response.ok) {
      const errMsg = data?.message || data?.error || `Failed to create payment link (${response.status})`;
      throw new Error(errMsg);
    }

    const link = data.link || data.paymentLink || data.url || data.paymentUrl || '';
    const txnId = data.paymentId || data.txnId || data.transactionId || data.id || '';

    if (!link) {
      throw new Error('Payment link not received from server. Please try again.');
    }

    return { link, txnId };
  } catch (err) {
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network error. Please check your internet connection and try again.');
    }
    throw err;
  }
};

export const formatAmount = (amount) => {
  return '₹' + Number(amount || 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

export const validatePhone = (phone) => /^[6-9]\d{9}$/.test(phone);

export const validatePAN = (pan) => /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/.test(pan);
