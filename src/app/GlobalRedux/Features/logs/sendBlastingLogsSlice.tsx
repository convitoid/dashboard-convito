import { createSlice } from '@reduxjs/toolkit';
import { createSendBlastingLogs } from '../../Thunk/logs/sendBlastingLogsThunk';

interface SendBlastingLogs {
   datas: any[] | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   error: any;
}

const initialState: SendBlastingLogs = {
   datas: [],
   status: 'idle',
   error: '',
};

export const sendBlastingLogsSlice = createSlice({
   name: 'sendBlastingLogs',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(createSendBlastingLogs.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(createSendBlastingLogs.fulfilled, (state, action) => {
            state.status = 'success';
            state.datas = action.payload.data;
         })
         .addCase(createSendBlastingLogs.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action;
         });
   },
});

export default sendBlastingLogsSlice.reducer;
