import { createAsyncThunk } from '@reduxjs/toolkit';

export const uploadQrGuests = createAsyncThunk('clients/uploadQrGuests', async (payload: any) => {
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
      console.log(data);
      return data;
   } catch (error) {
      return error;
   }
});

export const getQrGuests = createAsyncThunk('clients/getQrGuests', async (clientId: string) => {
   console.log(clientId);
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
      console.log(data);
      return data;
   } catch (error) {
      return error;
   }
});
