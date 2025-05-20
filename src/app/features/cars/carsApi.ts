'use client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Car, AddCarRequest, UpdateCarPriceRequest } from '@/types/car';

export const carsApi = createApi({
  reducerPath: 'carsApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:7000' }),
  tagTypes: ['Car'],
  endpoints: (builder) => ({
    getAgencyCars: builder.query<Car[], string>({
      query: (agencyId) => `cars?agencyId=${agencyId}`,
      providesTags: ['Car'],
    }),
    addCar: builder.mutation<Car, AddCarRequest>({
      query: (newCar) => ({
        url: 'cars',
        method: 'POST',
        body: newCar,
      }),
      invalidatesTags: ['Car'],
    }),
    updateCarPrice: builder.mutation<Car, UpdateCarPriceRequest>({
      query: ({ id, ...rest }) => ({
        url: `cars/${id}`,
        method: 'PATCH',
        body: rest,
      }),
      invalidatesTags: ['Car'],
    }),
    deleteCar: builder.mutation<void, string>({
      query: (id) => ({
        url: `cars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Car'],
    }),
  }),
});

export const {
  useGetAgencyCarsQuery,
  useAddCarMutation,
  useUpdateCarPriceMutation,
  useDeleteCarMutation,
} = carsApi;