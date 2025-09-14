// slices/doctorsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  doctorsList: [],
  loading: false,
  error: null,
  selectedDoctor: null,
};

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {
    setDoctors: (state, action) => {
      state.doctorsList = action.payload;
      state.error = null;
    },
    addDoctor: (state, action) => {
      state.doctorsList.push(action.payload);
    },
    updateDoctor: (state, action) => {
      const { id, updates } = action.payload;
      const index = state.doctorsList.findIndex(
        (doc) => doc.id === id || doc.uid === id
      );
      if (index !== -1) {
        state.doctorsList[index] = { ...state.doctorsList[index], ...updates };
      }
    },
    removeDoctor: (state, action) => {
      state.doctorsList = state.doctorsList.filter(
        (doc) => doc.id !== action.payload && doc.uid !== action.payload
      );
    },
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
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
  setDoctors,
  addDoctor,
  updateDoctor,
  removeDoctor,
  setSelectedDoctor,
  setLoading,
  setError,
  clearError,
} = doctorsSlice.actions;

export default doctorsSlice.reducer;