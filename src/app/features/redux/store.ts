'use client'
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import carReducer from './carSlice';
import reservationReducer from './reservationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    car: carReducer,
    reservation: reservationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;