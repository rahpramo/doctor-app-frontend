// pages/AllAppointments.js (updated)
import React, {useCallback, useEffect} from "react";
import {Box, Typography, Divider, CircularProgress, Alert} from "@mui/material";
import {useAppointments} from "../hooks/useAppointments";
import AppointmentCard from "../components/AppointmentCard";
import ConfirmationDialog from "../components/ConfirmationDialog";

const AllAppointments = () => {
  const {
    appointments,
    loading,
    error,
    processingId,
    dialogOpen,
    dialogConfig,
    loadAppointments,
    handleDelete,
    handleUpdate,
    showDialog,
    hideDialog,
    setError,
  } = useAppointments();

  useEffect(() => {
    if (!appointments || appointments.length === 0) {
      loadAppointments();
    }
  }, [loadAppointments, appointments, appointments.length]);

  const handleDeleteClick = useCallback(
    (appointment) => {
      showDialog({
        title: "Cancel Appointment",
        message: `Are you sure you want to cancel the appointment with Dr. ${appointment.doctorName}?`,
        severity: "warning",
        onConfirm: () => handleDelete(appointment.documentId, appointment),
        confirmText: "Yes, Cancel",
        cancelText: "Keep Appointment",
      });
    },
    [showDialog, handleDelete]
  );

  const handleUpdateClick = useCallback(
    (appointment, status) => {
      const action = status === "Approved" ? "approve" : "reject";

      showDialog({
        title: `${status === "Approved" ? "Approve" : "Reject"} Appointment`,
        message: `Are you sure you want to ${action} the appointment with Dr. ${appointment.doctorName}?`,
        severity: status === "Approved" ? "info" : "warning",
        onConfirm: () =>
          handleUpdate(appointment.documentId, status, appointment),
        confirmText: `Yes, ${action}`,
        cancelText: "Cancel",
      });
    },
    [showDialog, handleUpdate]
  );

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
        aria-busy="true"
        aria-label="Loading all appointments"
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
        All Appointments
      </Typography>

      {!appointments || appointments.length === 0 ? (
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          sx={{py: 4}}
        >
          No appointments found.
        </Typography>
      ) : (
        appointments &&
        appointments?.map((appt, idx) => (
          <Box key={appt.documentId || appt.id}>
            <AppointmentCard
              appointment={appt}
              onUpdate={(appt, status) => handleUpdateClick(appt, status)}
              onDelete={(appt) => handleDeleteClick(appt)}
              processingId={processingId}
              showAdminActions={true}
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

export default React.memo(AllAppointments);
