import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, RadioGroup, FormControlLabel, Radio,
  TextField, Typography, Box, Stack, Avatar, CircularProgress
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import { BannerPayload } from "@/types/banner";

export interface BannerDialogProps {
  open: boolean;
  initial?: BannerPayload;
  onClose: () => void;
  onSubmit: (payload: BannerPayload) => void;
  loading?: boolean;
}

const BannerDialog: React.FC<BannerDialogProps> = ({
  open, initial, onClose, onSubmit, loading = false
}) => {
  const isEdit = Boolean(initial?.id);

  const [mode,      setMode]      = useState<"text"|"image">(initial?.type || "text");
  const [title,     setTitle]     = useState(initial?.title || "");
  const [body,      setBody]      = useState(initial?.body || "");
  const [imageFile, setImageFile] = useState<File|null>(null);

  useEffect(() => {
    if (initial) {
      setMode(initial.type);
      setTitle(initial.title || "");
      setBody(initial.body  || "");
      setImageFile(null);
    } else {
      setMode("text");
      setTitle("");
      setBody("");
      setImageFile(null);
    }
  }, [initial, open]);

  const handleModeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMode(e.target.value as "text"|"image");
    setImageFile(null);
  };
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImageFile(e.target.files[0]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initial?.id,
      type: mode,
      title: mode==="text" ? title : undefined,
      body:  mode==="text" ? body  : undefined,
      imageFile: mode==="image" ? imageFile! : undefined,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        {isEdit ? "Edit Banner" : "Add Banner"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3} mt={2}>
            <Typography>Banner Type</Typography>
            <RadioGroup row value={mode} onChange={handleModeChange}>
              <FormControlLabel value="text"  control={<Radio />} label="Text" />
              <FormControlLabel value="image" control={<Radio />} label="Image"/>
            </RadioGroup>

            {mode === "text" && (
              <Stack spacing={2}>
                <TextField
                  label="Title" fullWidth required
                  value={title} onChange={e => setTitle(e.target.value)}
                />
                <TextField
                  label="Body"  fullWidth required multiline rows={4}
                  value={body}  onChange={e => setBody(e.target.value)}
                />
              </Stack>
            )}

            {mode === "image" && (
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{ alignSelf:"flex-start" , color: "white" }}
                >
                  {isEdit && !imageFile ? "Change Image" : "Upload Image"}
                  <input
                    type="file" hidden accept="image/*"
                    onChange={handleImageChange}
                    required={!isEdit}
                  />
                </Button>
                {(imageFile || initial?.id) && (
                  <Box display="flex" alignItems="center" gap={2} mt={1}>
                    <Avatar
                      src={
                        imageFile
                          ? URL.createObjectURL(imageFile)
                          : initial?.id
                            ? `http://your.cdn/${initial.id}.jpg`
                            : undefined
                      }
                      variant="rounded"
                      sx={{ width:80, height:80 }}
                    />
                    <Typography noWrap>
                      {imageFile?.name ?? "(existing image)"}
                    </Typography>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px:3, pb:2 }}>
          <Button onClick={onClose} disabled={loading} sx={{color: "black" ,bgcolor: "grey.300"}}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || (mode==="image" && !imageFile && !isEdit)}
            sx={{color: "white"}}
          >
            {loading ? <CircularProgress size={20} color="inherit" /> : isEdit ? "Save" : "Add"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BannerDialog;
