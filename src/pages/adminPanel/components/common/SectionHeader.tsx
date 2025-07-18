import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useLanguage } from "@/contexts/language/LanguageContext";

const SectionHeader: React.FC<{
  titleEn: string;
  titleAr: string;
  count: number;
}> = ({ titleEn, titleAr, count }) => {
  const { lang } = useLanguage();
  const isRtl = lang === "ar";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        p: 3,
        backgroundColor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
        direction: isRtl ? "rtl" : "ltr",
        textAlign: isRtl ? "right" : "left",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: "100%",
          justifyContent: "start",
        }}
      >
        <Typography variant="h5" fontWeight={600} color="primary.main">
          {isRtl ? titleAr : titleEn}
        </Typography>
        <Chip
          label={isRtl ? "بانتظار الموافقة" : "Awaiting Approval"}
          color="warning"
          size="small"
          sx={{ fontWeight: 500 }}
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {count}{" "}
        {isRtl
          ? "عقارات بحاجة للمراجعة قبل النشر"
          : "properties requiring review before publication"}
      </Typography>
    </Box>
  );
};

export default SectionHeader;
