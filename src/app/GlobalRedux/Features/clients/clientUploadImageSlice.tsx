import { createSlice } from '@reduxjs/toolkit';
import { deleteImage, getClientImages, uploadImage } from '../../Thunk/clients/clientUploadImageThunk';

interface ClientUploadImage {
   images: any | '';
   clientImages: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   statusClientImages: 'idle' | 'loading' | 'failed' | 'success';
   isOpenModal: boolean;
   error: any | null;
}

const initialState: ClientUploadImage = {
   images: [],
   clientImages: [],
   status: 'idle',
   statusClientImages: 'idle',
   isOpenModal: false,
   error: null,
};

export const clientUploadImageSlice = createSlice({
   name: 'clientUploadImage',
   initialState,
   reducers: {
      openModal: (state) => {
         state.isOpenModal = true;
      },

      closeModal: (state) => {
         state.isOpenModal = false;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getClientImages.pending, (state) => {
            state.statusClientImages = 'loading';
         })
         .addCase(getClientImages.fulfilled, (state, action) => {
            state.statusClientImages = 'success';
            state.clientImages = action.payload.data;
         })
         .addCase(getClientImages.rejected, (state, action) => {
            state.statusClientImages = 'failed';
            state.error = action.error.message;
         })

         .addCase(uploadImage.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(uploadImage.fulfilled, (state, action) => {
            state.status = 'success';
            state.images = action.payload.data;
         })
         .addCase(uploadImage.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(deleteImage.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(deleteImage.fulfilled, (state, action) => {
            state.status = 'success';
            state.images = action.payload.data;
         })
         .addCase(deleteImage.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export const { openModal, closeModal } = clientUploadImageSlice.actions;
export default clientUploadImageSlice.reducer;
