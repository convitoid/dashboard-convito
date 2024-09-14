import { createAsyncThunk } from '@reduxjs/toolkit';

export const createSendBlastingLogs = createAsyncThunk(
   'sendBlastingLogs/createSendBlastingLogs',
   async (payload: any) => {
      return payload;
   }
);
