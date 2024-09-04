import prisma from '@/libs/prisma';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendBlasting = createAsyncThunk('sendBlasting', async (payload: any) => {
   // return payload;
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/send-blasting/${payload.clientId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
         body: JSON.stringify(payload.data),
      });

      const data = await response.json();
      console.log('data', data);
      return data;
   } catch (error) {
      return error;
   }
});
