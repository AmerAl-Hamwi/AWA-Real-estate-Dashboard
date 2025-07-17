import React from "react";
import { Box, Typography, Paper, Divider, Link, useTheme } from "@mui/material";
import AdminLoginForm from "@components/ui/form/adminLoginForm";
// import Logo from "@assets/svg/Savi-logo.svg";

const AdminLoginPage: React.FC = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 500,
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: theme.shadows[10],
        }}
      >
        {/* Header with Logo */}
        <Box
          sx={{
            backgroundColor: "#01C38D",
            p: 3,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            component="h1"
            sx={{
              height: 60,
              filter: "brightness(0) invert(1)",
              fontFamily: "adamina",
            }}
          >
            AWA
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: 1,
            }}
          >
            ADMIN PORTAL
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              mt: 1,
              fontStyle: "italic",
            }}
          >
            Secure access to management dashboard
          </Typography>
        </Box>

        {/* Login Form Section */}
        <Box
          sx={{
            p: 4,
            backgroundColor: "#ffffff",
            position: "relative",
          }}
        >
          {/* Version Info */}
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              top: 8,
              right: 16,
              color: theme.palette.text.secondary,
            }}
          >
            v3.0.0
          </Typography>
          
          <AdminLoginForm />

          {/* Footer Links */}
          <Divider sx={{ my: 3 }} />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                textAlign: "right",
              }}
            >
              Need help?{" "}
              <Link
                href="/support"
                sx={{
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Contact Support
              </Link>
            </Typography>
          </Box>
        </Box>

        {/* Copyright Footer */}
        <Box
          sx={{
            backgroundColor: theme.palette.grey[100],
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.secondary,
              fontSize: "0.75rem",
            }}
          >
            © {new Date().getFullYear()} AWA. All rights reserved.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminLoginPage;
