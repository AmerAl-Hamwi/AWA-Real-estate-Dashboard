// import React, { useState, useEffect } from 'react';
// import { ThemeContext, ThemeContextType } from '@contexts/ThemeContext';

// interface ThemeProviderProps {
//   children: React.ReactNode;
// }

// export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
//   const [theme, setTheme] = useState<'light' | 'dark'>(() => {
//     const storedTheme = localStorage.getItem('theme');
//     return storedTheme === 'dark' ? 'dark' : 'light';
//   });

//   useEffect(() => {
//     const root = document.documentElement;
//     root.classList.remove(theme === 'light' ? 'dark' : 'light');
//     root.classList.add(theme);
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

//   const value: ThemeContextType = { theme, toggleTheme };

//   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
// };

// export default ThemeProvider;
