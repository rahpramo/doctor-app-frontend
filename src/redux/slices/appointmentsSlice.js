// slices/appointmentsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const appointmentsSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (state, action) => {
      state.list = action.payload;
      state.error = null;
    },
    addAppointment: (state, action) => {
      state.list.push(action.payload);
      state.error = null;
    },
    updateAppointment: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.list.findIndex(
        (appt) => appt.id === id || appt.appointmentId === id
      );
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...updates };
      }
      state.error = null;
    },
    cancelAppointment: (state, action) => {
      const index = state.list.findIndex(
        (appt) => appt.id === action.payload || appt.appointmentId === action.payload
      );
      if (index !== -1) {
        state.list[index].status = "cancelled";
      }
    },
    removeAppointment: (state, action) => {
      state.list = state.list.filter(
        (appt) =>
          appt.id !== action.payload && appt.appointmentId !== action.payload
      );
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  cancelAppointment,
  removeAppointment,
  setLoading,
  setError,
  clearError,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;

