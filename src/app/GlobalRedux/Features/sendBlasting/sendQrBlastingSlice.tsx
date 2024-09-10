import { createSlice } from '@reduxjs/toolkit';
import { sendQrBlasting } from '../../Thunk/sendBlasting/sendQrBlastingThunk';

interface QrSendBlasting {
   datas: any | '';
   data: any | '';
   checkAll: boolean;
   selectedRows: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success' | 'sending' | 'sent' | 'sendFailed';
   error: any | null;
}

const initialState: QrSendBlasting = {
   datas: '',
   data: '',
   checkAll: false,
   selectedRows: {},
   status: 'idle',
   error: null,
};

export const sendQrBlastingSlice = createSlice({
   name: 'sendQrBlasting',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(sendQrBlasting.pending, (state) => {
            state.status = 'sending';
         })
         .addCase(sendQrBlasting.fulfilled, (state, action) => {
            state.status = 'sent';
            state.datas = action.payload;
         })
         .addCase(sendQrBlasting.rejected, (state, action) => {
            state.status = 'sendFailed';
            state.error = action.error.message;
         });
   },
});

export default sendQrBlastingSlice.reducer;
