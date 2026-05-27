export function formatTimestamp(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: true, timeZone: 'Asia/Kolkata',
  }) + ' IST';
}

export function formatTxnId(id) {
  if (!id) return '—';
  return id.toUpperCase();
}

export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

export const MOCK_RESPONSE = {
  ver: '1.21.0',
  timestamp: '2026-05-19T07:12:48.577Z',
  txnid: '3e0c0ad6-6e39-481c-87d8-baad16f2ee55',
  errorCode: 'InternalError',
  status: false,
  data: [],
  errorMsg: 'Data is not available for the given consent',
};

export const MOCK_SUCCESS_RESPONSE = {
  ver: '1.21.0',
  timestamp: new Date().toISOString(),
  txnid: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  errorCode: null,
  status: true,
  data: [
    {
      accountType: 'SAVINGS',
      maskedAccNumber: 'XXXXXXXXXXXX1234',
      ifsc: 'HDFC0001234',
      balance: 125430.75,
      currency: 'INR',
      fiType: 'DEPOSIT',
      holderId: 'CUST-98765',
    },
    {
      accountType: 'CURRENT',
      maskedAccNumber: 'XXXXXXXXXXXX5678',
      ifsc: 'ICIC0009876',
      balance: 850000.0,
      currency: 'INR',
      fiType: 'DEPOSIT',
      holderId: 'CUST-98765',
    },
  ],
  errorMsg: null,
};

export const ERROR_CODE_MAP = {
  InternalError: 'An unexpected error occurred on the FIP/AA server.',
  NoDataFound: 'No financial data found for the linked accounts.',
  DataFetchFailed: 'Unable to fetch data from the Financial Information Provider.',
  ConsentExpired: 'The consent has expired. Request fresh consent to proceed.',
  ConsentRevoked: 'The customer has revoked this consent.',
  Unauthorized: 'The request is unauthorized. Check your API keys.',
  InvalidRequest: 'The request payload is malformed or missing required fields.',
  ServiceUnavailable: 'The service is temporarily unavailable. Try again later.',
};
