import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendQrBlasting = createAsyncThunk('sendBlasting/sendQrBlasting', async (payload: any) => {
   console.log('payload', payload);
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/send-blasting/qr/${payload.clientId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
         body: JSON.stringify(payload.data),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      const errorMessage = error as Error;
      console.log('errorMessage', errorMessage);
      return errorMessage;
   }
});
