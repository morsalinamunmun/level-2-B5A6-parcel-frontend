import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';


export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'sender' | 'receiver' | 'admin';
  status: 'active' | 'blocked';
  createdAt: string;
}

export interface Parcel {
  _id: string;
  trackingId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverAddress: string;
  parcelType: string;
  weight: number;
  price: number;
  deliveryDate: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'cancelled';
  statusHistory: StatusLog[];
  createdAt: string;
  updatedAt: string;
}

export interface StatusLog {
  status: string;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    // user: User;
    accessToken: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'sender' | 'receiver';
}

export const parcelApi = createApi({
  reducerPath: 'parcelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Parcel'],
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Parcel endpoints
    getAllParcels: builder.query<Parcel[], void>({
      query: () => '/parcels',
      providesTags: ['Parcel'],
    }),
    getParcelByTrackingId: builder.query<Parcel, string>({
      query: (trackingId) => `/parcels/track/${trackingId}`,
      providesTags: ['Parcel'],
    }),
    createParcel: builder.mutation<Parcel, Partial<Parcel>>({
      query: (parcelData) => ({
        url: '/parcels',
        method: 'POST',
        body: parcelData,
      }),
      invalidatesTags: ['Parcel'],
    }),
    updateParcelStatus: builder.mutation<Parcel, { id: string; status: string; note?: string }>({
      query: ({ id, ...patch }) => ({
        url: `/parcels/${id}/status`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: ['Parcel'],
    }),
    deleteParcel: builder.mutation<void, string>({
      query: (id) => ({
        url: `/parcels/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Parcel'],
    }),
    
    // User endpoints
    getAllUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    updateUserStatus: builder.mutation<User, { id: string; status: 'active' | 'blocked' }>({
      query: ({ id, status }) => ({
        url: `/users/${id}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetAllParcelsQuery,
  useGetParcelByTrackingIdQuery,
  useCreateParcelMutation,
  useUpdateParcelStatusMutation,
  useDeleteParcelMutation,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
} = parcelApi;