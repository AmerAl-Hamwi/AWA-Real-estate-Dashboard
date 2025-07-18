import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, useTheme, useMediaQuery } from "@mui/material";
import {
  HelpOutline as HelpIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { menuItems, MenuItemDef } from "./variable/menuItems";
import { useToasterContext } from "@contexts/toaster/useToasterContext";
import { useAuthService } from "@hooks/api/auth/useAuthService";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface FooterItem {
  icon: React.ElementType;
  onClick: () => void;
  labelEn: string;
  labelAr: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { showToaster } = useToasterContext();
  const { logout } = useAuthService();
  const { lang } = useLanguage();
  const [showLabels, setShowLabels] = useState(!isCollapsed);

  useEffect(() => {
    if (!isCollapsed) setTimeout(() => setShowLabels(true), 200);
    else setShowLabels(false);
  }, [isCollapsed]);

  // Determine width: on mobile, full or zero; on desktop, collapsedWidth or fullWidth
  const width = isMobile ? (isCollapsed ? 0 : 260) : isCollapsed ? 73 : 260;

  const handleLogout = async () => {
    try {
      await logout();
      showToaster({ message: "Logout successful!", type: "success" });
      navigate("/admin/login");
    } catch (err) {
      showToaster({ message: err.message, type: "error" });
    }
  };

  const footerItems: FooterItem[] = [
    {
      icon: HelpIcon,
      onClick: () => {
        /* show help */
      },
      labelEn: "Help",
      labelAr: "مساعدة",
    },
    {
      icon: LogoutIcon,
      onClick: () => handleLogout(),
      labelEn: "Log out",
      labelAr: "تسجيل الخروج",
    },
  ];

  return (
    <>
      {isMobile && !isCollapsed && (
        <Box
          onClick={() => setIsCollapsed(true)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            bgcolor: "rgba(0,0,0,0.5)",
            zIndex: 29,
          }}
        />
      )}
      <Box
        component="nav"
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width,
          bgcolor: "background.paper",
          color: "text.primary",
          borderRight: 1,
          borderColor: "divider",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.3s ease",
          boxShadow: 4,
          zIndex: 30,
          overflowX: "hidden",
        }}
      >
        {/* header omitted for brevity */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            m: 2,
          }}
        >
          {isCollapsed ? (
            <Box
              component="span"
              sx={{
                opacity: 1,
                transition: "opacity 0.3s",
                fontSize: { xs: "25px", lg: "40px" },
                fontFamily: "adamina",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "center",
                color: "black",
              }}
            >
              A
            </Box>
          ) : (
            <Box
              component="span"
              sx={{
                opacity: 1,
                transition: "opacity 0.3s",
                fontSize: { xs: "45px", lg: "45px" },
                fontFamily: "adamina",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textAlign: "center",
                color: "black",
              }}
            >
              AWA
            </Box>
          )}
        </Box>

        <hr className="mb-8 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />

        {/* Menu */}
        <Box sx={{ flexGrow: 1, px: 2, overflowY: "auto" }}>
          {menuItems.map(
            ({ icon: Icon, route, labelEn, labelAr }: MenuItemDef) => {
              const selected = location.pathname === route;
              const label = lang === "ar" ? labelAr : labelEn;
              return (
                <Box
                  key={route}
                  onClick={() => {
                    navigate(route);
                    if (isMobile) setIsCollapsed(true);
                  }}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    px: 1,
                    py: 1,
                    mb: 1,
                    borderRadius: 2,
                    cursor: "pointer",
                    bgcolor: selected ? "primary.dark" : "transparent",
                    color: selected ? "background.default" : "text.primary",
                    "&:hover": {
                      bgcolor: "primary.dark",
                      color: "background.default",
                    },
                    transition: "background-color 0.2s, color 0.2s",
                  }}
                >
                  <Icon fontSize="medium" />
                  {width > 73 && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        opacity: showLabels ? 1 : 0,
                        transform: showLabels
                          ? "translateX(0)"
                          : "translateX(-8px)",
                        transition: "opacity 0.2s, transform 0.2s",
                      }}
                    >
                      {label}
                    </Box>
                  )}
                </Box>
              );
            }
          )}
        </Box>

        {/* Footer */}
        <Box sx={{ px: 2, pb: 2 }}>
          {footerItems.map(({ icon: Icon, onClick, labelEn, labelAr }) => {
            const label = lang === "ar" ? labelAr : labelEn;
            return (
              <Box
                key={labelEn}
                onClick={onClick}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 1,
                  py: 1,
                  mb: 1,
                  borderRadius: 2,
                  cursor: "pointer",
                  "&:hover": {
                    bgcolor: theme.palette.primary.dark,
                    color: theme.palette.background.default,
                  },
                  transition: "background-color 0.2s, color 0.2s",
                }}
              >
                <Icon fontSize="medium" />
                {width > 73 && (
                  <Box
                    component="span"
                    sx={{
                      ml: 1,
                      opacity: showLabels ? 1 : 0,
                      transform: showLabels
                        ? "translateX(0)"
                        : "translateX(-8px)",
                      transition: "opacity 0.2s, transform 0.2s",
                    }}
                  >
                    {label}
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
