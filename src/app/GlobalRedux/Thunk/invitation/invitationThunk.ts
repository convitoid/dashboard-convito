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
