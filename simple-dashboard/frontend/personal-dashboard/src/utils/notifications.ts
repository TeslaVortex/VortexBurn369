import toast from 'react-hot-toast';

// Success notifications
export const notifySuccess = (message: string) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
      fontWeight: '500',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10B981',
    },
  });
};

// Error notifications
export const notifyError = (message: string) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Warning notifications
export const notifyWarning = (message: string) => {
  toast(message, {
    duration: 4000,
    position: 'top-right',
    icon: '⚠️',
    style: {
      background: '#F59E0B',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Info notifications
export const notifyInfo = (message: string) => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: 'ℹ️',
    style: {
      background: '#3B82F6',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Special notifications
export const notifyBurn = (amount: string) => {
  toast(`🔥 Burned ${amount} ETH!`, {
    duration: 5000,
    position: 'top-center',
    style: {
      background: 'linear-gradient(135deg, #F97316 0%, #EF4444 100%)',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1.1rem',
      padding: '16px 24px',
    },
  });
};

export const notifyOverBudget = () => {
  toast.error('🚨 Over budget! Cut spending!', {
    duration: 5000,
    position: 'top-center',
    style: {
      background: '#DC2626',
      color: '#fff',
      fontWeight: 'bold',
      fontSize: '1.1rem',
    },
  });
};

export const notifyWalletConnected = (address: string) => {
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
  toast.success(`Wallet connected! ${shortAddr}`, {
    duration: 3000,
    position: 'top-right',
    icon: '🦊',
  });
};

export const notifyIncome = (amount: string) => {
  toast(`💰 Money in! +${amount} ETH`, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#059669',
      color: '#fff',
      fontWeight: '500',
    },
  });
};

// Loading toast (returns dismiss function)
export const notifyLoading = (message: string) => {
  return toast.loading(message, {
    position: 'top-right',
  });
};

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
};
