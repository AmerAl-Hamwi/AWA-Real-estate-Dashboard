import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Box,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

interface NavbarProps {
  activeTab: string;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: theme.shadows[1],
        borderRadius: { xs: 0, sm: 2 },
        mt: { xs: 0, sm: 2 },
        px: 2,
        py: 1,
        backdropFilter: "blur(20px)",
        background:
          theme.palette.mode === "light"
            ? "rgba(255, 255, 255, 0.8)"
            : "rgba(36, 48, 63, 0.8)",
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 0, sm: 2 },
          gap: 2,
        }}
      >
        {/* Left Section - Collapse Button */}
        <Box display="flex" alignItems="center">
          <IconButton
            onClick={() => setIsCollapsed(!isCollapsed)}
            sx={{ color: "text.primary" }}
          >
            {isCollapsed ? <MenuIcon /> : <CloseIcon />}
          </IconButton>
        </Box>

        {/* Right Section - Actions */}
        <Box display="flex" alignItems="center">
          {/* Notifications */}
          <IconButton sx={{ color: "text.secondary",  }}>
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Profile Dropdown */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ ml: 2 }}
          >
            <Avatar
              src="https://placehold.co/150"
              sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
            />
            {!isMobile && (
              <Box textAlign="left">
                <Typography variant="body2" fontWeight={500} noWrap>
                  John Doe
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  noWrap
                  sx={{ display: { xs: "none", sm: "block" } }}
                >
                  john@example.com
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;