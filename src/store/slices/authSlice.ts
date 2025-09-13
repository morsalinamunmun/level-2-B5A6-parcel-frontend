import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../api/parcelApi';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}



// Add this function to safely get token from localStorage
const getStoredToken = (): string | null => {
  try {
    const token = localStorage.getItem("token")
    return token ? token.replace(/^"(.*)"$/, "$1") : null
  } catch {
    return null
  }
}
const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: getStoredToken(),
  isAuthenticated: !!getStoredToken(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    token: getStoredToken(),
    isAuthenticated: !!getStoredToken(),
  },
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
       localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout, clearAuth } = authSlice.actions;
export default authSlice.reducer;



