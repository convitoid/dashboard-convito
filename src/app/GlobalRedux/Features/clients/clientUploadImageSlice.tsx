import { createSlice } from '@reduxjs/toolkit';
import { uploadImage } from '../../Thunk/clients/clientUploadImageThunk';

interface ClientUploadImage {
   images: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   error: any | null;
}

const initialState: ClientUploadImage = {
   images: [],
   status: 'idle',
   error: null,
};

export const clientUploadImageSlice = createSlice({
   name: 'clientUploadImage',
   initialState,
   reducers: {},
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

export default clientUploadImageSlice.reducer;
