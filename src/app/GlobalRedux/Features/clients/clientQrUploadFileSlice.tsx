import { createSlice } from '@reduxjs/toolkit';
import { uploadQrFile } from '../../Thunk/clients/clientQrUploadFileThunk';

interface ClientQrUploadFile {
   files: any | '';
   datas: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success' | 'deleteLoading' | 'deleteSuccess' | 'deleteFailed';
   error: any | null;
}

const initialState: ClientQrUploadFile = {
   files: [],
   datas: [],
   status: 'idle',
   error: null,
};

export const clientQrUploadFileSlice = createSlice({
   name: 'clientQrUploadFile',
   initialState,
   reducers: {
      resetStatusQr: (state) => {
         state.status = 'idle';
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(uploadQrFile.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(uploadQrFile.fulfilled, (state, action) => {
            state.status = 'success';
            state.files = action.payload.data;
         })
         .addCase(uploadQrFile.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export const { resetStatusQr } = clientQrUploadFileSlice.actions;
export default clientQrUploadFileSlice.reducer;
