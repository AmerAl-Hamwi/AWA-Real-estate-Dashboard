import { Box, Button, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PageNotFound = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'start',
        minHeight: '85vh',
        textAlign: 'center',
        p: 3,
        background: `linear-gradient(15deg, ${theme.palette.background.paper} 0%, ${theme.palette.grey[100]} 100%)`,
      }}
    >
      {/* Animated 404 Number */}
      <Box
        component={motion.div}
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
        sx={{
          mb: 4,
          mt: 15,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          color: theme.palette.error.main,
        }}
      >
        <ErrorOutlineIcon sx={{ fontSize: isMobile ? '4rem' : '6rem' }} />
        <Typography
          variant="h1"
          component="div"
          sx={{
            fontSize: isMobile ? '4rem' : '6rem',
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: 'monospace',
          }}
        >
          404
        </Typography>
      </Box>

      {/* Main Message */}
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        sx={{
          fontWeight: 600,
          mb: 2,
          color: theme.palette.text.primary,
        }}
      >
        Page Not Found
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          maxWidth: 600,
          mb: 4,
          color: theme.palette.text.secondary,
          fontSize: isMobile ? '1rem' : '1.125rem',
          lineHeight: 1.6,
        }}
      >
        The page you're looking for might have been removed, had its name changed,
        or is temporarily unavailable.
      </Typography>

      {/* Action Buttons */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          size="large"
          sx={{
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: theme.shadows[2],
            background: theme.palette.secondary.main,
            color: 'white',
            '&:hover': {
              boxShadow: theme.shadows[4],
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          Go Back
        </Button>
        
        <Button
          variant="outlined"
          onClick={() => (window.location.href = '/')}
          size="large"
          sx={{
            px: 4,
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            borderWidth: 2,
            borderColor: "#191E29",
            color: "#191E29",
            '&:hover': {
              borderWidth: 2,
              backgroundColor: theme.palette.action.hover,
            },
          }}
        >
          Return Home
        </Button>
      </Box>

      {/* Error Code Footer */}
      <Typography
        variant="caption"
        sx={{
          position: 'absolute',
          bottom: 29,
          color: theme.palette.text.disabled,
          mt: 4,
        }}
      >
        Error Code: 404 • Resource Not Found
      </Typography>
    </Box>
  );
};

export default PageNotFound;