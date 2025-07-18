import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { useLanguage } from "@/contexts/language/LanguageContext";

interface Props {
  titleEn: string;
  titleAr: string;
  countTextEn: string;
  countTextAr: string;
  count: number;
  showFilterButton?: React.ReactNode; // optional button like "Filter"
}

const LocalizedSectionHeader: React.FC<Props> = ({
  titleEn,
  titleAr,
  countTextEn,
  countTextAr,
  count,
  showFilterButton,
}) => {
  const { lang } = useLanguage();
  const isArabic = lang === "ar";

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
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h5" fontWeight={600} color="primary.main">
            {isArabic ? titleAr : titleEn}
          </Typography>
          <Chip
            label={isArabic ? "تمت الموافقة من المشرف" : "Approved by Admin"}
            color="success"
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Optional filter or action buttons */}
        {showFilterButton && <Box>{showFilterButton}</Box>}
      </Box>

      <Typography variant="body2" color="text.secondary">
        {isArabic
          ? `${count} ${countTextAr}`
          : `${count} ${countTextEn}`}
      </Typography>
    </Box>
  );
};

export default LocalizedSectionHeader;