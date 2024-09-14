import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadQrGuests = createAsyncThunk(
   'clients/uploadQrGuests',
   async (payload: any, { dispatch, rejectWithValue }) => {
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });

         const response = await fetch('/api/uploads/qr/guests', {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${getToken.user.jwt}`,
            },
            body: payload,
         });

         const data = await response.json();
         return data;
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const getQrGuests = createAsyncThunk('clients/getQrGuests', async (clientId: string) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/qr/guests/${clientId}`, {
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});
