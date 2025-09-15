// slices/appointmentsSlice.js
import {createSlice} from "@reduxjs/toolkit";

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
      const {id, updates} = action.payload;
      const index = state.list.findIndex(
        (appt) => appt.id === id || appt.appointmentId === id
      );
      if (index !== -1) {
        state.list[index] = {...state.list[index], ...updates};
      }
      state.error = null;
    },
    cancelAppointment: (state, action) => {
      const index = state.list.findIndex(
        (appt) =>
          appt.id === action.payload || appt.appointmentId === action.payload
      );
      if (index !== -1) {
        state.list[index].status = "cancelled";
      }
    },
  },
});

export const {
  setAppointments,
  addAppointment,
  updateAppointment,
  cancelAppointment,
} = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
