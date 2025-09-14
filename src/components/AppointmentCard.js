// components/AppointmentCard.js
import React, { useCallback } from "react";
import {
  Box,
  Typography,
  Grid,
  Avatar,
  Button,
  Chip
} from "@mui/material";
import {
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";

const strapiMediaUrl = process.env.REACT_APP_CLOUD_STRAPI_MEDIA_URL

const AppointmentCard = React.memo(({ 
  appointment, 
  onUpdate, 
  onDelete, 
  processingId,
  showAdminActions = false,
  onPay 
}) => {
  const isProcessing = processingId === appointment.documentId;

  const formatDateTime = useCallback((date, time) => {
    return `${date} | ${time}`;
  }, []);

  const getStatusColor = useCallback((status) => {
    const statusColors = {
      confirmed: "success",
      pending: "warning",
      cancelled: "error",
      completed: "info",
      approved: "success"
    };
    return statusColors[status.toLowerCase()] || "default";
  }, []);

  const handleUpdateClick = useCallback((status) => {
    onUpdate?.(appointment, status);
  }, [appointment.documentId, onUpdate]);

  const handleDeleteClick = useCallback(() => {
    onDelete?.(appointment);
  }, [appointment.documentId, onDelete]);

  const handlePayClick = useCallback(() => {
    onPay?.(appointment);
  }, [appointment, onPay]);

  return (
    <Box role="listitem" sx={{ py: 2 }}>
      <Grid container spacing={3} alignItems="flex-start">
        {/* Doctor Image */}
        <Grid item xs={12} sm={3} md={2}>
          <Avatar
             src={!appointment.doctorAvatar ? `${strapiMediaUrl}/upload_area_8bc1382fd8.png` : appointment.doctorAvatar}
            alt={`Photo of Dr. ${appointment.doctorName}`}
            variant="rounded"
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: "primary.light",
              fontSize: "2rem"
            }}
            onError={(e) => {
              e.target.src = "";
              e.target.alt = "Default doctor avatar";
            }}
          />
        </Grid>

        {/* Appointment Info */}
        <Grid item xs={12} sm={6} md={7}>
          <Typography
            variant="h6"
            component="h3"
            fontWeight="600"
            color="text.primary"
            gutterBottom
          >
            Dr. {appointment.doctorName}
          </Typography>
          
          <Typography 
            variant="body1" 
            color="primary.main" 
            fontWeight="500"
            gutterBottom
          >
            {appointment.speciality || appointment.specialty}
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            <Box component="span" fontWeight="500" color="text.primary">
              Address:
            </Box>{" "}
            {appointment.address}
          </Typography>

          <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
            <Box component="span" fontWeight="500" color="text.primary">
              Date & Time:
            </Box>{" "}
            {formatDateTime(appointment.appointmentDate, appointment.appointmentTime)}
          </Typography>
          
          <Box sx={{ mt: 1, display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2" color="text.primary" fontWeight="500">
              Status:
            </Typography>
            <Chip 
              label={appointment.appointmentState} 
              color={getStatusColor(appointment.appointmentState)}
              size="small"
            />
          </Box>
        </Grid>

        {/* Action Buttons */}
        <Grid
          item
          xs={12}
          sm={3}
          md={3}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            alignItems: "stretch",
          }}
        >
          {showAdminActions ? (
            <>
              <Button
                variant="contained"
                color="success"
                startIcon={<CheckIcon />}
                onClick={() => handleUpdateClick("Approved")}
                disabled={isProcessing || appointment.appointmentState === "Approved"}
                aria-label={`Approve appointment with Dr. ${appointment.doctorName}`}
              >
                {isProcessing ? "Processing..." : "Approve"}
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<CloseIcon />}
                onClick={() => handleUpdateClick("Cancelled")}
                disabled={isProcessing || appointment.appointmentState === "Cancelled"}
                aria-label={`Cancel appointment with Dr. ${appointment.doctorName}`}
              >
                {isProcessing ? "Processing..." : "Reject"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                onClick={handlePayClick}
                disabled={appointment.appointmentState === "Cancelled" || isProcessing}
                aria-label={`Pay online for appointment with Dr. ${appointment.doctorName}`}
              >
                Pay Online
              </Button>
              
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDeleteClick}
                disabled={appointment.appointmentState === "Cancelled" || isProcessing}
                aria-label={`Cancel appointment with Dr. ${appointment.doctorName}`}
              >
                {isProcessing ? "Cancelling..." : "Cancel"}
              </Button>
            </>
          )}
        </Grid>
      </Grid>
    </Box>
  );
});

AppointmentCard.displayName = "AppointmentCard";

export default AppointmentCard;
