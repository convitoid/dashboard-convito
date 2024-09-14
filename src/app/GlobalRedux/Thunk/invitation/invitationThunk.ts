import { createAsyncThunk } from '@reduxjs/toolkit';

export const getInvitation = createAsyncThunk('invitation/getInvitation', async (payload: any) => {
   try {
      const response = await fetch(`/api/invitations/${payload}`);

      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});

export const updateAnswer = createAsyncThunk('invitation/updateAnswer', async (payload: any) => {
   try {
      const response = await fetch(`/api/invitations/answer/${payload.guestId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(payload.data),
      });
      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});

export const getAnswer = createAsyncThunk('invitation/getAnswer', async (payload?: any) => {
   try {
      if (payload) {
         const response = await fetch(`/api/invitations/answer/${payload.data.id}`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         });
         const data = await response.json();
         return data;
      }
   } catch (error) {
      return error;
   }
});
