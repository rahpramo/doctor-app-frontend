// pages/MyAppointments.js (updated)
import React, {useCallback, useEffect} from "react";
import {Box, Typography, Divider, CircularProgress, Alert} from "@mui/material";
import {useAppointments} from "../../hooks/useAppointments";
import AppointmentCard from "./AppointmentCard";
import ConfirmationDialog from "./ConfirmationDialog";

const MyAppointments = () => {
  const {
    appointments,
    loading,
    error,
    processingId,
    dialogOpen,
    dialogConfig,
    handleDelete,
    showDialog,
    hideDialog,
    setError,
    getAppointmentById,
  } = useAppointments();

  useEffect(() => {
    if (appointments.length === 0) {
      const user = JSON.parse(localStorage.getItem("user"));
      getAppointmentById(user.email);
    }
  }, [getAppointmentById, appointments.length]);

  const handlePayOnline = useCallback(() => {
    // Payment integration logic
  }, []);

  const handleDeleteClick = useCallback(
    (appointment) => {
      showDialog({
        title: "Cancel Appointment",
        message: `Are you sure you want to cancel your appointment with Dr. ${appointment.doctorName} on ${appointment.appointmentDate}?`,
        severity: "warning",
        onConfirm: () => handleDelete(appointment.documentId, appointment),
        confirmText: "Yes, Cancel",
        cancelText: "Keep Appointment",
      });
    },
    [showDialog, handleDelete]
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        aria-busy="true"
        aria-label="Loading my appointments"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={6} sx={{p: 4}}>
        <Alert
          severity="error"
          onClose={() => setError("")}
          aria-live="assertive"
        >
          {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box mt={6} sx={{p: 4}} component="main">
      <Typography
        variant="h4"
        component="h1"
        sx={{
          pb: 2,
          mb: 3,
          borderBottom: "2px solid",
          borderColor: "divider",
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        My Appointments
      </Typography>

      {appointments.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{py: 4}}
        >
          No appointments booked yet.
        </Typography>
      ) : (
        appointments.map((appt, idx) => (
          <Box key={appt.documentId || appt.id}>
            <AppointmentCard
              appointment={appt}
              onDelete={(appt) => handleDeleteClick(appt)}
              onPay={handlePayOnline}
              processingId={processingId}
              showAdminActions={false}
            />
            {idx < appointments.length - 1 && (
              <Divider sx={{my: 2}} aria-hidden="true" />
            )}
          </Box>
        ))
      )}

      <ConfirmationDialog
        open={dialogOpen}
        onClose={hideDialog}
        onConfirm={dialogConfig.onConfirm}
        title={dialogConfig.title}
        message={dialogConfig.message}
        confirmText={dialogConfig.confirmText}
        cancelText={dialogConfig.cancelText}
        severity={dialogConfig.severity}
        loading={processingId !== null}
      />
    </Box>
  );
};

export default React.memo(MyAppointments);
