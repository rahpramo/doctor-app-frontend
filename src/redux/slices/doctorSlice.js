// slices/doctorsSlice.js
import {createSlice} from "@reduxjs/toolkit";

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
    setSelectedDoctor: (state, action) => {
      state.selectedDoctor = action.payload;
    },
  },
});

export const {setDoctors, setSelectedDoctor} = doctorsSlice.actions;

export default doctorsSlice.reducer;
