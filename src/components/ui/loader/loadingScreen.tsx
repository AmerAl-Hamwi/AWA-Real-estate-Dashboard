// PageLoader.tsx
import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import { styled } from '@mui/system';

// Define a smooth dual-ring spin animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
`;

// Styled ring element
const Ring = styled('div')(() => ({
  boxSizing: 'border-box',
  display: 'block',
  width: 64,
  height: 64,
  border: '6px solid #e0e0e0',
  borderTopColor: '#ca1d4f',        // your accent
  borderRadius: '50%',
  animation: `${spin} 1s linear infinite`,
}));

const PageLoader: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => (
  <Box
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    sx={{ backgroundColor: '#f5f5f5' }} // light page background
  >
    <Ring />
    {label && (
      <Typography
        variant="subtitle1"
        sx={{ mt: 2, color: '#5d5a55', fontWeight: 500 }}
      >
        {label}
      </Typography>
    )}
  </Box>
);

export default PageLoader;
