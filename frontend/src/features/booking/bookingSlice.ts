import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as bookingService from '@services/bookingService';
import { IBookingState, IBooking, IBookingForm } from '@types';
import { logger } from '@utils/logger';

const initialState: IBookingState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  filters: {},
};

export const fetchBookings = createAsyncThunk<
  IBooking[],
  void,
  {
    rejectValue: string;
  }
>('booking/fetchBookings', async (_, { rejectWithValue }) => {
  try {
    const response = await bookingService.getBookings();
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch bookings';
    logger.error('Fetch bookings error:', error);
    return rejectWithValue(message);
  }
});

export const createBooking = createAsyncThunk<
  IBooking,
  IBookingForm,
  {
    rejectValue: string;
  }
>('booking/createBooking', async (bookingData, { rejectWithValue }) => {
  try {
    const response = await bookingService.createBooking(bookingData);
    logger.info('Booking created successfully');
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create booking';
    logger.error('Create booking error:', error);
    return rejectWithValue(message);
  }
});

export const updateBookingStatus = createAsyncThunk<
  IBooking,
  { bookingId: string; status: string },
  {
    rejectValue: string;
  }
>('booking/updateBookingStatus', async ({ bookingId, status }, { rejectWithValue }) => {
  try {
    const response = await bookingService.updateBookingStatus(bookingId, status);
    logger.info('Booking status updated');
    return response.data;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update booking';
    logger.error('Update booking error:', error);
    return rejectWithValue(message);
  }
});

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch bookings';
      })
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create booking';
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b.id === action.payload.id);
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      });
  },
});

export const { clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
