import { useState, useCallback, useRef } from 'react';

let showToastFn = null;

export function ToastContainer() {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  showToastFn = useCallback((msg, isError = false) => {
    setToast({ msg, isError });
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  if (!toast) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
      background: toast.isError ? '#C62828' : '#1C1B1F',
      color: '#fff', padding: '12px 24px', borderRadius: 50,
      fontSize: 14, fontWeight: 800, zIndex: 9999,
      whiteSpace: 'nowrap', boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
      animation: 'fadeIn .25s ease',
    }}>
      {toast.msg}
    </div>
  );
}

export const toast = (msg, isError = false) => showToastFn?.(msg, isError);
