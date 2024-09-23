import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null,
    error: null,
    loading: false,
  },
  reducers: {
    loginStart: (state) => {
      state.currentUser = null;
      state.loading = false;
    },
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutStart: (state) => {
      state.currentUser = null;
      state.loading = false;
    }
  },
});

export const { loginStart, loginSuccess, loginFailure, logoutStart } = userSlice.actions;

export const selectUser = (state) => state.user;

export default userSlice.reducer;