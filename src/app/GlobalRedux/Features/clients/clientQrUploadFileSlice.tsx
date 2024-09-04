import { createSlice } from '@reduxjs/toolkit';
import { getQrFiles, uploadQrFile } from '../../Thunk/clients/clientQrUploadFileThunk';

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
      resetDataFiles: (state) => {
         state.files = [];
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
         })

         .addCase(getQrFiles.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getQrFiles.fulfilled, (state, action) => {
            console.log('dari thunk', action.payload);
            state.status = 'success';
            state.files = action.payload.data;
         })
         .addCase(getQrFiles.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export const { resetStatusQr, resetDataFiles } = clientQrUploadFileSlice.actions;
export default clientQrUploadFileSlice.reducer;
