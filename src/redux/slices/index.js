import {configureStore} from "@reduxjs/toolkit";
import appointmentsReducer from "./appointmentsSlice";
import userReducer from "./userSlice";
import doctorReducer from "./doctorSlice";

const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    user: userReducer, // ← add your user slice here
    doctors: doctorReducer, // ← add your doctors slice here
  },
});

export default store;
