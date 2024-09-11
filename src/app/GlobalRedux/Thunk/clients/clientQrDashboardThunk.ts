import { getToken } from 'next-auth/jwt';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchClientQrDashboard = createAsyncThunk(
   'clientQrDashboard/fetchClientQrDashboard',
   async (payload: any) => {
      console.log('dari thunk', payload);
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });

         const response = await fetch(`/api/clients/qr/dashboard/${payload.clientId}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${getToken.user.jwt}`,
            },
         });

         const data = await response.json();
         return data;
      } catch (error) {
         return error;
      }
   }
);
