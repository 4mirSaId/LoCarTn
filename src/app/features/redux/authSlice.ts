import {createSlice} from '@reduxjs/toolkit';

// AuthUser interface for Redux user state
export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  agencyId?: string;
  token?: string;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null as AuthUser | null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;