import React, { FC, ReactNode } from 'react';
import { ToasterContext } from './toasterContext';
import { useToaster } from '@hooks/custom/useToaster';
import ToasterComponent from '@components/feedback/toasterComponent';

export const ToasterProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { showToaster, toaster } = useToaster();

  return (
    <ToasterContext.Provider value={{ showToaster }}>
      {children}
      <ToasterComponent toaster={toaster} />
    </ToasterContext.Provider>
  );
};