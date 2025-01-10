// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import Swal from 'sweetalert2';

// Define the initial state
const initialState = {
  users: [],
  user: null,
  accessToken: Cookies.get('token') || null,
  refreshToken: null,
  role: null,
  loading: false,
  error: null,
};

// Async thunk for Sign In
export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ user_email, password, role }, { rejectWithValue }) => {
    const apiUrl = `http://localhost:8000/user/signIn`;

    try {
      const response = await axios.post(
        apiUrl,
        { user_email, password },
        // { withCredentials: true }
      );
      console.log(response.data.access_token);
      Cookies.set('access_token', response.data.access_token);
      Cookies.set('refresh_token', response.data.refresh_token);
      Cookies.set('token', response.data.access_token, { expires: 7, secure: true });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Sign In Failed');
    }
  }
);

// Async thunk for Sign Up
export const signUp = createAsyncThunk(
  'auth/signUp',
  async (formData, { rejectWithValue }) => {
    let apiUrl = '';
    if (formData.role === 'Instructor') {
      apiUrl = 'http://localhost:8000/user/instructor/signUp';
    } else if (formData.role === 'Student') {
      apiUrl = 'http://localhost:8000/user/student/signUp';
    }

    try {
      const response = await axios.post(apiUrl, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Sign Up Failed');
    }
  }
);

// Async thunk for fetching user data
export const fetchUserData = createAsyncThunk('auth/fetchUserData', async (_, thunkAPI) => {
  try {
    const token = Cookies.get('token');
    
    if (!token) {
      return thunkAPI.rejectWithValue({ status: 401, message: 'No token provided' });
    }
    
    const response = await axios.get('http://localhost:8000/user/info', {
      withCredentials: true
    });
    
    console.log(response);
    return response.data.user;
  } catch (error) {
    if (error.response) {
      if (error.response.status === 401) {
        return thunkAPI.rejectWithValue({ status: 401, message: 'Unauthorized, no token' });
      } else if (error.response.status === 403) {
        return thunkAPI.rejectWithValue({ status: 403, message: 'Session expired, please log in again' });
      }
    }
    
    return thunkAPI.rejectWithValue({ status: error.response?.status, message: 'An error occurred' });
  }
});

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk('auth/fetchUsers', async (_, thunkAPI) => {
  try {
    const response = await axios.get('http://localhost:8000/user/getAllUsers');
    return response.data.users;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'An error occurred');
  }
});

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
      state.error = null;
      Cookies.remove('token');
      localStorage.removeItem('auth');
    },
    // Action to set authentication state from localStorage
    setCredentials(state, action) {
      const { user, accessToken, refreshToken, role } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.role = role;
    },
  },
  extraReducers: (builder) => {
    // Sign In
    builder
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.access_token;
        state.refreshToken = action.payload.refresh_token;
        state.role = action.payload.role;
        state.error = null;
        localStorage.setItem('auth', JSON.stringify(state));
        // Dispatch fetchUserData to get user info after login
        fetchUserData();
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign In Failed';
      });

    // Sign Up
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        Swal.fire({
          title: 'Success',
          text: 'Account created successfully! Please sign in.',
          icon: 'success',
          confirmButtonText: 'OK',
        });
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Sign Up Failed';
        Swal.fire({
          title: 'Error',
          text: state.error,
          icon: 'error',
          confirmButtonText: 'OK',
        });
      });

    // Fetch User Data
    builder
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
        state.user = null;
      });

    // Fetch Users
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
        state.status = 'failed';
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;

export default authSlice.reducer;