import React, { useState, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  Paper,
  Chip,
  Stack,
  CircularProgress
} from "@mui/material";
import {
  LocalizationProvider,
  DateTimePicker,
  DesktopDateTimePicker,
  MobileDateTimePicker
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useDispatch, useSelector } from "react-redux";
import { format, isBefore, isToday, addMinutes } from "date-fns";
import { useApi } from "../hooks/useApi";
import { 
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  LocationOn as LocationIcon
} from "@mui/icons-material";
import { addAppointment } from "../redux/slices/appointmentsSlice";
import { createAppointment } from "../services/data";

const BookingSection = ({ selectedDoctor }) => {
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { callApi } = useApi();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleBook = useCallback(async () => {
    if (!selectedDateTime || !selectedDoctor || !user) return;

    setLoading(true);
    
    try {
      const date = new Date(selectedDateTime);
      
      // Validate selected time (should be at least 30 minutes from now)
      const now = new Date();
      const minBookingTime = addMinutes(now, 30);
      
      if (isBefore(date, minBookingTime)) {
        setSnackbar({
          open: true,
          message: "Please select a time at least 30 minutes from now",
          severity: "error"
        });
        setLoading(false);
        return;
      }

      const formattedDate = format(date, "yyyy-MM-dd");
      const formattedTime = format(date, "HH:mm:ss.SSS");

      const newAppointment = {
        appointmentId: Date.now().toString(),
        doctorName: selectedDoctor.name,
        doctorId: selectedDoctor.id || selectedDoctor.uid,
        appointmentDate: formattedDate,
        appointmentTime: formattedTime,
        doctorAvatar: selectedDoctor.avatar?.url || "",
        appointmentState: "pending",
        speciality: selectedDoctor.speciality || "",
        address: selectedDoctor.address || "",
        about: selectedDoctor.about || "",
        userId: user.id || user.uid,
        userEmail: user.email,
        fee: selectedDoctor.fee || "Not specified"
      };

      // Create appointment in Strapi
      const result = await callApi(createAppointment, newAppointment);
      
      if (result.success) {
        // Dispatch to Redux store
        dispatch(addAppointment(result.data));
        
        setSnackbar({
          open: true,
          message: `Booked ${selectedDoctor.name} at ${date.toLocaleString()} successfully!`,
          severity: "success"
        });
        
        setSelectedDateTime(null);
      } else {
        throw new Error(result.error || "Failed to create appointment");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to book appointment. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  }, [selectedDateTime, selectedDoctor, user, dispatch, callApi]);

  const handleCloseSnackbar = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const isTimeSlotAvailable = useCallback((date) => {
    // Add logic here to check if the time slot is available
    // This could check against existing appointments for this doctor
    return true; // Placeholder
  }, []);

  const shouldDisableTime = useCallback((date) => {
    // Disable past times
    const now = new Date();
    return isBefore(date, now);
  }, []);

  if (!selectedDoctor) {
    return (
      <Alert severity="warning" sx={{ mt: 3 }}>
        Please select a doctor to book an appointment.
      </Alert>
    );
  }

  return (
    <Box mt={4}>
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom fontWeight="600">
          Book Appointment with Dr. {selectedDoctor.name}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap">
          <Chip 
            icon={<CalendarIcon />} 
            label={selectedDoctor.speciality} 
            color="primary" 
            variant="outlined"
          />
          {selectedDoctor.experience && (
            <Chip 
              label={`${selectedDoctor.experience} years experience`} 
              variant="outlined"
            />
          )}
          {selectedDoctor.fee && (
            <Chip 
              label={`Fee: ${selectedDoctor.fee}`} 
              color="secondary"
            />
          )}
        </Stack>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Select a date and time for your appointment. Appointments must be made at least 30 minutes in advance.
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Box sx={{ display: { xs: 'none', md: 'block' } }}>
            <DesktopDateTimePicker
              label="Select Date & Time"
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              disablePast
              shouldDisableTime={shouldDisableTime}
              minTime={addMinutes(new Date(), 30)}
              slotProps={{
                textField: { 
                  fullWidth: true,
                  sx: { mb: 2 }
                },
              }}
            />
          </Box>
          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <MobileDateTimePicker
              label="Select Date & Time"
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              disablePast
              shouldDisableTime={shouldDisableTime}
              minTime={addMinutes(new Date(), 30)}
              slotProps={{
                textField: { 
                  fullWidth: true,
                  sx: { mb: 2 }
                },
              }}
            />
          </Box>
        </LocalizationProvider>

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={!selectedDateTime || loading}
          onClick={handleBook}
          sx={{ 
            mt: 2,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Booking...
            </>
          ) : (
            `Book Appointment - ${selectedDoctor.fee || "N/A"}`
          )}
        </Button>

        {selectedDateTime && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
            Selected: {format(selectedDateTime, "PPP 'at' p")}
          </Typography>
        )}
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default React.memo(BookingSection);
