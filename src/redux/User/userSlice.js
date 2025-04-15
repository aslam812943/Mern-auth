import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = {
        id: action.payload.id,
        username: action.payload.username,
        email: action.payload.email,
        profilePicture: action.payload.profilePicture // Add this
      };
      state.loading = false;
      state.error = null;
    },
    signInFailer: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
    },
    updateUserSuccess: (state, action) => {  // Add this new reducer
      state.currentUser = {
        ...state.currentUser,
        ...action.payload
      };
    }
  }
});

export const { 
  signInStart, 
  signInSuccess,  
  logoutSuccess,
  signInFailer,
  updateUserSuccess // Export the new action
} = userSlice.actions;

export default userSlice.reducer;