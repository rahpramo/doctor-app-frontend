// hooks/useAppointments.js (updated)
import {useState, useCallback} from "react";
import {
  fetchAppointments,
  deleteAppointment,
  updateAppointment,
} from "../services/data";
import {fetchAppointmentsByUser} from "../services/data";

export const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const loadAppointments = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const appointmentList = await fetchAppointments();
      if (appointmentList?.data) setAppointments(appointmentList.data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const showDialog = useCallback((config) => {
    setDialogConfig(config);
    setDialogOpen(true);
  }, []);

  const hideDialog = useCallback(() => {
    setDialogOpen(false);
    setDialogConfig({});
  }, []);

  const handleDelete = useCallback(
    async (id, appointmentData) => {
      try {
        setProcessingId(id);
        await deleteAppointment(id);
        setAppointments((prev) =>
          prev.filter((appt) => appt.documentId !== id)
        );
        hideDialog();
      } catch (err) {
        console.error("Failed to delete appointment:", err);
        setError("Failed to delete appointment. Please try again.");
        hideDialog();
        throw err;
      } finally {
        setProcessingId(null);
      }
    },
    [hideDialog]
  );

  const handleUpdate = useCallback(
    async (id, status, appointmentData) => {
      try {
        setProcessingId(id);
        const updateField = {appointmentState: status};
        await updateAppointment(id, updateField);

        setAppointments((prev) =>
          prev.map((appt) =>
            appt.documentId === id ? {...appt, appointmentState: status} : appt
          )
        );
        hideDialog();
      } catch (err) {
        console.error("Failed to update appointment:", err);
        setError("Failed to update appointment. Please try again.");
        hideDialog();
        throw err;
      } finally {
        setProcessingId(null);
      }
    },
    [hideDialog]
  );

  const getAppointmentById = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError("");
      const appointmentList = await fetchAppointmentsByUser(userId);

      setAppointments(appointmentList?.data);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
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
    getAppointmentById,
  };
};
