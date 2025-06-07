import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../../axios';
import * as axiosLib from 'axios';

export const addCar = createAsyncThunk(
  'car/addCar',
  async (
    { formData, token }: { formData: FormData; token?: string },
    { rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      };
      const { data } = await axios.post('/api/cars', formData, config);
      return data;
    } catch (error: unknown) {
      if (axiosLib.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || error.message);
      }
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof (error as { message: unknown }).message === 'string'
      ) {
        return rejectWithValue((error as { message: string }).message);
      }
      return rejectWithValue('An unknown error occurred');
    }
  }
);

const carSlice = createSlice({
  name: 'car',
  initialState: {
    loading: false,
    error: null as string | null,
    success: false,
  },
  reducers: {
    resetCarState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addCar.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addCar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to add car';
        state.success = false;
      });
  },
});

export const { resetCarState } = carSlice.actions;
export default carSlice.reducer;
