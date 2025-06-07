import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../../axios';

export const createReservation = createAsyncThunk(
  'reservation/createReservation',
  async (
    { carId, from, to, token }: { carId: string; from: string; to: string; token?: string },
    { rejectWithValue }
  ) => {
    try {
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
      const { data } = await axios.post(`/api/reservations/${carId}`, { from, to }, { headers });
      return data;
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      return rejectWithValue(err.response?.data?.message || err.message || 'Unknown error');
    }
  }
);

const reservationSlice = createSlice({
  name: 'reservation',
  initialState: {
    loading: false,
    error: null as string | null,
    success: false,
  },
  reducers: {
    resetReservationState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createReservation.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReservation.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createReservation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to reserve';
        state.success = false;
      });
  },
});

export const { resetReservationState } = reservationSlice.actions;
export default reservationSlice.reducer;
