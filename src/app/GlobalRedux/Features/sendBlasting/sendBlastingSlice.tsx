import { createSlice } from '@reduxjs/toolkit';
import { sendBlasting } from '../../Thunk/sendBlasting/sendBlastingThunk';

interface SendBlasting {
   datas: any | '';
   data: any | '';
   checkAll: boolean;
   selectedRows: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success' | 'sending' | 'sent' | 'sendFailed';
   error: any | null;
}

const initialState: SendBlasting = {
   datas: '',
   data: '',
   checkAll: false,
   selectedRows: {},
   status: 'idle',
   error: null,
};

export const sendBlastingSlice = createSlice({
   name: 'sendBlasting',
   initialState,
   reducers: {
      setSelectAllAction: (state) => {
         state.checkAll = !state.checkAll;
      },

      setSelectedRowsAction: (state, action) => {
         state.selectedRows = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder.addCase(sendBlasting.pending, (state) => {
         state.status = 'sending';
      });
      builder.addCase(sendBlasting.fulfilled, (state, action) => {
         state.status = 'sent';
      });
      builder.addCase(sendBlasting.rejected, (state, action) => {
         state.status = 'sendFailed';
         state.error = action.error.message;
      });
   },
});

export const { setSelectAllAction, setSelectedRowsAction } = sendBlastingSlice.actions;
export default sendBlastingSlice.reducer;
