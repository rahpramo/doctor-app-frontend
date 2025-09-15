// components/ConfirmationDialog.js
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Box,
  CircularProgress
} from "@mui/material";
import {
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Error as ErrorIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";

const ConfirmationDialog = React.memo(({
  open = false,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  severity = "info", // "info", "warning", "error", "success"
  loading = false,
  disableConfirm = false,
  disableCancel = false
}) => {
  const getSeverityIcon = () => {
    switch (severity) {
      case "warning":
        return <WarningIcon color="warning" sx={{ fontSize: 40 }} />;
      case "error":
        return <ErrorIcon color="error" sx={{ fontSize: 40 }} />;
      case "success":
        return <CheckCircleIcon color="success" sx={{ fontSize: 40 }} />;
      case "info":
      default:
        return <InfoIcon color="info" sx={{ fontSize: 40 }} />;
    }
  };

  const getConfirmButtonColor = () => {
    switch (severity) {
      case "warning":
        return "warning";
      case "error":
        return "error";
      case "success":
        return "success";
      case "info":
      default:
        return "primary";
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="confirmation-dialog-title">
        <Box display="flex" alignItems="center" gap={1}>
          {getSeverityIcon()}
          {title}
        </Box>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          disabled={loading}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Typography 
          id="confirmation-dialog-description" 
          variant="body1"
          sx={{ mt: 1, lineHeight: 1.5 }}
        >
          {message}
        </Typography>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          disabled={loading || disableCancel}
          variant="outlined"
          aria-label={cancelText}
        >
          {cancelText}
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading || disableConfirm}
          color={getConfirmButtonColor()}
          variant="contained"
          autoFocus
          startIcon={loading ? <CircularProgress size={16} /> : null}
          aria-label={confirmText}
        >
          {loading ? "Processing..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
});

ConfirmationDialog.displayName = "ConfirmationDialog";

export default ConfirmationDialog;
