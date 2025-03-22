import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const API_URL = 'https://cave-digital-backend-dbke.onrender.com/tasks';

// Async thunk to fetch tasks
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch tasks');
  }
});

// Async thunk to add a task
export const addTask = createAsyncThunk('tasks/addTask', async (task, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(API_URL, task, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to add task');
  }
});

// Async thunk to update a task
// export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, title, description }, { rejectWithValue }) => {
//   try {
//     const token = await AsyncStorage.getItem('token');
//     await axios.put(`${API_URL}/${id}`, { title, description }, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return { id, title, description };
//   } catch (error) {
//     return rejectWithValue(error.response?.data || 'Failed to update task');
//   }
// });

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, title, description, status }, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.put(
        `${API_URL}/${id}`,
        { title, description, ...(status !== undefined && { status }) }, // Only send 'status' if provided
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data; // Return updated task
    } catch (error) {
      console.error('Update Task Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to update task');
    }
  }
);

// Async thunk to delete a task
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem('token');
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return id;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to delete task');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState: { tasks: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
      });
  },
});

export default taskSlice.reducer;
