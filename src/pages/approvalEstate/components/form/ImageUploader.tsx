import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Avatar,
  IconButton,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface ImageUploaderProps {
  existingImages: { id: string; url: string }[];
  newImages: File[];
  onAdd: (files: File[]) => void;
  onRemoveExisting: (idx: number) => void;
  onRemoveNew: (idx: number) => void;
  onReplace: (idx: number, file: File) => void; // new
}

export default function ImageUploader({
  existingImages,
  newImages,
  onAdd,
  onRemoveExisting,
  onRemoveNew,
  onReplace
}: ImageUploaderProps) {
  console.log(existingImages);
  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted.length) onAdd(accepted);
    },
    [onAdd]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Images
      </Typography>

      <Paper
        {...getRootProps()}
        variant="outlined"
        sx={{
          p: 2,
          mb: 3,
          textAlign: "center",
          cursor: "pointer",
          bgcolor: isDragActive ? "grey.100" : "grey.50",
          border: "2px dashed",
          borderColor: isDragActive ? "primary.main" : "grey.300",
          borderRadius: 2,
          transition: "background-color 0.2s, border-color 0.2s",
        }}
      >
        <input {...getInputProps()} />
        <AddPhotoAlternateIcon
          sx={{ fontSize: 40, mb: 1, color: "grey.600" }}
        />
        <Typography color="text.secondary">
          {isDragActive
            ? "Drop images here"
            : "Drag & drop images, or click to select"}
        </Typography>
        <Button size="small" sx={{ mt: 1 }} variant="outlined">
          Browse Files
        </Button>
      </Paper>

      <Stack direction="row" flexWrap="wrap" gap={2}>
        {existingImages.map(({ url }, idx) => (
          <Box key={`old-${idx}`} sx={{ position: "relative" }}>
            <Avatar
              src={url}
              variant="rounded"
              sx={{ width: 100, height: 100 }}
            />
            <IconButton
              size="small"
              onClick={() => onRemoveExisting(idx)}
              sx={{
                position: "absolute",
                top: 2,
                right: 2,
                bgcolor: "rgba(255,255,255,0.8)",
                "&:hover": { bgcolor: "rgba(255,255,255,1)" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            <Box sx={{ mt: 1 }}>
              <Button
                size="small"
                fullWidth
                variant="outlined"
                component="label"
              >
                Replace
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      onReplace(idx, e.target.files[0]);
                    }
                  }}
                />
              </Button>
            </Box>
          </Box>
        ))}

        {newImages.map((file, idx) => {
          const preview = URL.createObjectURL(file);
          return (
            <Box key={`new-${idx}`} sx={{ position: "relative" }}>
              <Avatar
                src={preview}
                variant="rounded"
                sx={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <IconButton
                size="small"
                onClick={() => onRemoveNew(idx)}
                sx={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  bgcolor: "rgba(255,255,255,0.8)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
