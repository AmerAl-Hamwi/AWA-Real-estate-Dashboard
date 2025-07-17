import { useState, useCallback, useEffect } from 'react';

type ToasterType = 'success' | 'error' | 'warning' | 'info';

export interface ToasterMessage {
  message: string;
  type?: ToasterType;
}

interface UseToasterHook {
  toaster: ToasterMessage | null;
  showToaster: (message: ToasterMessage, duration?: number) => void;
  clearToaster: () => void;
}

export const useToaster = (): UseToasterHook => {
  const [toaster, setToaster] = useState<ToasterMessage | null>(null);
  const [timerId, setTimerId] = useState<number | null>(null);

  const clearToaster = useCallback(() => {
    setToaster(null);
    if (timerId !== null) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  }, [timerId]);

  const showToaster = useCallback(
    ({ message, type = 'info' }: ToasterMessage, duration = 3000) => {
      clearToaster();
      setToaster({ message, type });
      const newTimerId = window.setTimeout(clearToaster, duration);
      setTimerId(newTimerId);
    },
    [clearToaster]
  );

  useEffect(() => {
    return () => {
      if (timerId !== null) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  return { toaster, showToaster, clearToaster };
};