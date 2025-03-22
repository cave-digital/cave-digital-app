import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Define API Base URL
const API_URL = 'https://cave-digital-backend-dbke.onrender.com/auth';

// **Async thunk for login**
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });

      const { token, user } = response.data;

      // Store token in AsyncStorage
      await AsyncStorage.setItem('token', token);

      return { user, token };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// **Async thunk for signup**
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async ({ name, email, password }: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email, password }, {
        headers: { 'Content-Type': 'application/json' },
      });

      return response.data; // Assuming response contains user data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

// **Async thunk for checking stored token**
export const checkAuthStatus = createAsyncThunk('auth/checkAuthStatus', async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      return rejectWithValue('No token found');
    }

    return { token };
  } catch (error) {
    return rejectWithValue('Failed to retrieve token');
  }
});

// **Async thunk for logout**
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { dispatch }) => {
  await AsyncStorage.removeItem('token');
  dispatch(logout());
});

// **Auth slice**
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Handle token retrieval
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.token = action.payload.token;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.token = null;
      })

      // Handle logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
