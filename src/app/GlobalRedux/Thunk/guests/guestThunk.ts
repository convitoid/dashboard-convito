import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGuests = createAsyncThunk('guest/fetchGuest', async (clientId: string) => {
   console.log('clientId', clientId);
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });
   const response = await fetch('/api/guests', {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify({
         clientId,
      }),
   });
   const data = await response.json();
   return data;
});

export const uploadGuests = createAsyncThunk('guest/uploadGuest', async (data: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });
   const response = await fetch('/api/uploads/guests', {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: data,
   });
   const res = await response.json();
   return res;
});
