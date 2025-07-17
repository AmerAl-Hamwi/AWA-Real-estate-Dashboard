import React from 'react';

interface ToasterContextType {
  showToaster: (message: { 
    message: string; 
    type?: 'success'|'error'|'warning'|'info' 
  }, duration?: number) => void;
}

export const ToasterContext = React.createContext<ToasterContextType | undefined>(undefined);