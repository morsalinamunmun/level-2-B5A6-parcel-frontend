
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'sender' | 'receiver' | 'admin';
  isActive: "ACTIVE" | "BLOCKED";
  createdAt: string;
}

export interface Parcel {
  _id: string;
  trackingId: string;
  senderId: {
    name: string;
    email: string;
    _id: string;
  };
  receiverId: {
    name: string;
    email: string;
    _id: string;
  };
  fee: number;
  type: string;
  weight: number;
  price: number;
  deliveryDate: string;
  statusLogs:[
    {
      status:'Pending' | 'In Transit' | 'Delivered' | 'Cancelled'| 'Requested' | 'Dispatched' | 'Approved';
      timestamp: string;
      location: string;
      note: string;
      updatedBy: string;
    }
  ];
  status: 'Pending' | 'In Transit' | 'Delivered' | 'Cancelled'| 'Requested' | 'Dispatched' | 'Approved';
  isBlocked: boolean;
  statusHistory: StatusLog[];
  createdAt: string;
  updatedAt: string;
}


// interface MyParcelsResponse {
//   data:Parcel[];
// }

// interface UsersResponse {
//   data: User[];
// }

export interface StatusLog {
  status: string;
  timestamp: string;
  updatedBy: string;
  note?: string;
}

export interface AuthResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data?: {
    accessToken: string;
    user: User;
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

interface ParcelsResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {parcels:Parcel[];};
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UsersResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: User[];
  meta?: {
    total: number;
  };
}

export const parcelApi = createApi({
  reducerPath: 'parcelApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_API_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('Authorization', `${token}`);
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
    
    // New Parcel endpoints
    cancelParcel: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/parcels/cancel/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Parcel'],
    }),
    getMyParcels: builder.query<{data:Parcel[]}, void>({
      query: () => `/parcels/me`,
      providesTags: ['Parcel'],
    }),
    getIncomingParcels: builder.query<{data:Parcel[]}, void>({
      query: () => `/parcels/incoming`,
      providesTags: ['Parcel'],
    }),
    confirmDelivery: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/parcels/confirm-delivery/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Parcel'],
    }),
    getParcelStatus: builder.query<{ status: string }, string>({
      query: (id) => `/parcels/status/${id}`,
      providesTags: ['Parcel'],
    }),
    getDeliveryHistory: builder.query<Parcel[], void>({
      query: () => `/parcels/delivery-history`,
      providesTags: ['Parcel'],
    }),
    toggleBlockParcel: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({
        url: `/parcels/toggle-block/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Parcel'],
    }),
    getParcelStatusLogs: builder.query<StatusLog[], string>({
      query: (id) => `/parcels/${id}/status-logs`,
      providesTags: ['Parcel'],
    }),
    
    // Existing Parcel endpoints
    getAllParcels: builder.query<ParcelsResponse, void>({
      query: () => '/parcels/all',
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
        url: `/parcels/status/${id}`,
        method: 'PATCH',
        body: patch
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
    getAllUsers: builder.query<UsersResponse, void>({
      query: () => '/user/users',
      providesTags: ['User'],
    }),
    blockUser: builder.mutation<User, string>({
  query: (id) => ({
    url: `/user/block/${id}`, // backend এ এই রুটটা ব্যবহার করুন
    method: 'PATCH',
  }),
  invalidatesTags: ['User'],
}),
unblockUser: builder.mutation<User, string>({
  query: (id) => ({
    url: `/user/unblock/${id}`,
    method: 'PATCH',
  }),
  invalidatesTags: ['User'],
}),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useCancelParcelMutation,
  useGetMyParcelsQuery,
  useGetIncomingParcelsQuery,
  useConfirmDeliveryMutation,
  useGetParcelStatusQuery,
  useGetDeliveryHistoryQuery,
  useToggleBlockParcelMutation,
  useGetParcelStatusLogsQuery,
  useGetAllParcelsQuery,
  useGetParcelByTrackingIdQuery,
  useCreateParcelMutation,
  useUpdateParcelStatusMutation,
  useDeleteParcelMutation,
  useGetAllUsersQuery,
  useBlockUserMutation,
  useUnblockUserMutation,
} = parcelApi;