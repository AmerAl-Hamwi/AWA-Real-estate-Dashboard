import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import { useLanguage } from "@/contexts/language/LanguageContext";
import { useToasterContext } from "@/contexts/toaster/useToasterContext";
import { useBroadcastMessage } from "@hooks/api/message/useBroadcastMessage";

interface NavbarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // language
  const { lang, setLang } = useLanguage();
  const [langAnchor, setLangAnchor] = useState<null | HTMLElement>(null);

  // auth (for token)

  // broadcast dialog
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { broadcast, loading: sending } = useBroadcastMessage();
  const { showToaster } = useToasterContext();

  const handleSend = async () => {
    const { success, error } = await broadcast({ title, body });
    setBroadcastOpen(false);
    setTitle("");
    setBody("");

    if (success) {
      showToaster({
        message: lang === "ar" ? "تم الإرسال بنجاح" : "Broadcast sent!",
        type: "success",
      });
    } else {
      showToaster({
        message: error?.message ?? (lang === "ar" ? "فشل الإرسال" : "Sending failed"),
        type: "error",
      });
    }
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "background.paper", color: "text.primary", boxShadow: theme.shadows[1], borderRadius: { xs: 0, sm: 2 }, mt: { xs: 0, sm: 2 }, px: 2, py: 1, backdropFilter: "blur(20px)", background: theme.palette.mode === "light" ? "rgba(255,255,255,0.8)" : "rgba(36,48,63,0.8)" }}>
        <Toolbar sx={{ justifyContent: "space-between", gap: 2 }}>
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <MenuIcon /> : <CloseIcon />}
          </IconButton>

          <Box display="flex" alignItems="center" gap={1}>
            {/* Broadcast */}
            <IconButton
              title={lang === "ar" ? "إرسال للجميع" : "Broadcast"}
              onClick={() => setBroadcastOpen(true)}
              disabled={sending}
            >
              <CampaignIcon />
            </IconButton>

            {/* Notifications */}
            <IconButton color="secondary">
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Language menu */}
            <IconButton onClick={e => setLangAnchor(e.currentTarget)}>
              <LanguageIcon />
            </IconButton>
            <Menu
              anchorEl={langAnchor}
              open={Boolean(langAnchor)}
              onClose={() => setLangAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem selected={lang === "en"} onClick={() => { setLang("en"); setLangAnchor(null); }}>English</MenuItem>
              <MenuItem selected={lang === "ar"} onClick={() => { setLang("ar"); setLangAnchor(null); }}>العربية</MenuItem>
            </Menu>

            {/* Profile */}
            <Box display="flex" alignItems="center" gap={1}>
              <Avatar src="https://placehold.co/150" sx={{ width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }} />
              {!isMobile && (
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {lang === "ar" ? "المسؤول" : "Admin"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" noWrap>
                    admin@gmail.com
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Broadcast Dialog */}
      <Dialog open={broadcastOpen} onClose={() => setBroadcastOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{lang === "ar" ? "إرسال رسالة عامة" : "Broadcast Message"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2}}>
          <TextField
            label={lang === "ar" ? "العنوان" : "Title"}
            fullWidth
            value={title}
            onChange={e => setTitle(e.target.value)}
            sx={{marginTop: 1 }}
          />
          <TextField
            label={lang === "ar" ? "المحتوى" : "Body"}
            fullWidth
            multiline
            minRows={4}
            value={body}
            onChange={e => setBody(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBroadcastOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
          <Button variant="contained" onClick={handleSend} disabled={sending}>
            {sending
              ? lang === "ar" ? "جارٍ الإرسال…" : "Sending…"
              : lang === "ar" ? "إرسال" : "Send"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;