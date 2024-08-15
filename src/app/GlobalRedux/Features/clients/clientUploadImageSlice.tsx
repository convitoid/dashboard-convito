import { createSlice } from '@reduxjs/toolkit';
import { uploadImage } from '../../Thunk/clients/clientUploadImageThunk';

interface ClientUploadImage {
   images: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   isOpenModal: boolean;
   error: any | null;
}

const initialState: ClientUploadImage = {
   images: [],
   status: 'idle',
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
         });
   },
});

export const { openModal, closeModal } = clientUploadImageSlice.actions;
export default clientUploadImageSlice.reducer;
