// slices/userSlice.js
import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  loggedIn: false,
  isAdmin: false,
  email: "",
  username: "",
  id: null,
  uid: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const {isAdmin, email, username, id, uid} = action.payload;
      state.loggedIn = true;
      state.isAdmin = isAdmin || false;
      state.email = email || "";
      state.username = username || "";
      state.id = id || null;
      state.uid = uid || null;
      state.error = null;
    },
    logoutUser: (state) => {
      state.loggedIn = false;
      state.isAdmin = false;
      state.email = "";
      state.username = "";
      state.id = null;
      state.uid = null;
      state.error = null;
    },
    updateUser: (state, action) => {
      const {email, username, isAdmin} = action.payload;
      if (email !== undefined) state.email = email;
      if (username !== undefined) state.username = username;
      if (isAdmin !== undefined) state.isAdmin = isAdmin;
    },
  },
});

export const {loginUser, logoutUser, updateUser} = userSlice.actions;

export default userSlice.reducer;
