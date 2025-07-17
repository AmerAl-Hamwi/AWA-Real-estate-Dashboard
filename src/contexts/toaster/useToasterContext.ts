import { useContext } from 'react';
import { ToasterContext } from './toasterContext';

export const useToasterContext = () => {
  const context = useContext(ToasterContext);
  if (!context) {
    throw new Error('useToasterContext must be used within a ToasterProvider');
  }
  return context;
};