import React from "react";
import { Dialog, DialogContent, Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface PropertyImageDialogProps {
  open: boolean;
  images: string[];
  activeIndex: number;
  onClose: () => void;
  onThumbnailClick: (index: number) => void;
}

const PropertyImageDialog: React.FC<PropertyImageDialogProps> = ({
  open,
  images,
  activeIndex,
  onClose,
  onThumbnailClick,
}) => {
  return (
    <>
      {open && (
        <Button
          onClick={onClose}
          variant="contained"
          color="error"
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1500,
            borderRadius: "50%",
            minWidth: 0,
            width: 40,
            height: 40,
            padding: 0,
            boxShadow: "0 4px 10px rgba(244, 67, 54, 0.7)",
            "&:hover": {
              backgroundColor: "#d32f2f",
              boxShadow: "0 6px 14px rgba(211, 47, 47, 0.8)",
            },
          }}
          aria-label="Close dialog"
        >
          <CloseIcon />
        </Button>
      )}

      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            p: 2,
            position: "relative",
          },
        }}
      >
        <DialogContent
          sx={{
            p: 0,
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Main Image Container (relative for overlay) */}
          {images.length > 0 && (
            <Box
              sx={{
                position: "relative",
                width: "100%",
                maxHeight: 450,
              }}
            >
              <Box
                component="img"
                src={`${images[activeIndex]}`}
                alt={`Image ${activeIndex + 1}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  userSelect: "none",
                  transition: "all 0.4s ease",
                }}
              />

              {/* Thumbnails Overlay */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(217,217,217,0.7)",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  display: "flex",
                  gap: 1,
                  zIndex: 2,
                  width: "fit-content",
                  maxWidth: "100%",
                  overflowX: "auto",
                }}
              >
                {images.map((src, idx) => (
                  <Box
                    key={src}
                    component="img"
                    src={`${src}`}
                    alt={`Thumbnail ${idx + 1}`}
                    onClick={() => onThumbnailClick(idx)}
                    sx={{
                      width: 100,
                      height: 70,
                      objectFit: "cover",
                      borderRadius: 2,
                      cursor: "pointer",
                      border:
                        idx === activeIndex
                          ? "3px solid #1976d2"
                          : "2px solid transparent",
                      filter: idx === activeIndex ? "none" : "brightness(0.8)",
                      transition: "all 0.3s ease",
                      userSelect: "none",
                      flexShrink: 0, // prevent shrinking on overflow
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertyImageDialog;
