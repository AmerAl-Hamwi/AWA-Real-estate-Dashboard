import { createContext } from 'react';

export interface ThemeContextType {
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
