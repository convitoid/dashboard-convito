import { createSlice } from '@reduxjs/toolkit';
import { deleteQrImage, getQrImages, uploadQrImage } from '../../Thunk/clients/clientQrUploadImageThunk';

interface ClientQrUploadImage {
   images: any | '';
   datas: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success' | 'deleteLoading' | 'deleteSuccess' | 'deleteFailed';
   error: any | null;
}

const initialState: ClientQrUploadImage = {
   images: [],
   datas: [],
   status: 'idle',
   error: null,
};

export const clientQrUploadImageSlice = createSlice({
   name: 'clientQrUploadImage',
   initialState,
   reducers: {
      resetStatusQr: (state) => {
         state.status = 'idle';
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(uploadQrImage.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(uploadQrImage.fulfilled, (state, action) => {
            state.status = 'success';
            state.images = action.payload.data;
         })
         .addCase(uploadQrImage.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(getQrImages.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getQrImages.fulfilled, (state, action) => {
            state.status = 'success';
            state.datas = action.payload;
         })
         .addCase(getQrImages.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(deleteQrImage.pending, (state) => {
            state.status = 'deleteLoading';
         })
         .addCase(deleteQrImage.fulfilled, (state) => {
            state.status = 'deleteSuccess';
         })
         .addCase(deleteQrImage.rejected, (state, action) => {
            state.status = 'deleteFailed';
            state.error = action.error.message;
         });
   },
});

export const { resetStatusQr } = clientQrUploadImageSlice.actions;
export default clientQrUploadImageSlice.reducer;
