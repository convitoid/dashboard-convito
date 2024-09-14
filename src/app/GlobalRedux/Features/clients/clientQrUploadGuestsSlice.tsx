import { createSlice } from '@reduxjs/toolkit';
import { getQrGuests, uploadQrGuests } from '../../Thunk/clients/clientQrUploadGuestsThunk';

interface ClientQrUploadGuestsState {
   data: any | '';
   guests: any | '';
   status: 'idle' | 'loading' | 'success' | 'uploadIdle' | 'uploadLoading' | 'uploadSuccess' | 'uploadFailed';
   error: any;
}

const initialState: ClientQrUploadGuestsState = {
   data: [],
   guests: [],
   status: 'idle',
   error: null,
};

export const clientQrUploadGuestsSLice = createSlice({
   name: 'clientQrUploadGuests',
   initialState,
   reducers: {
      resetQrGuestsStatus: (state) => {
         state.status = 'idle';
      },

      resetQrGuestsData: (state) => {
         state.guests = [];
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(uploadQrGuests.pending, (state) => {
            state.status = 'uploadLoading';
         })
         .addCase(uploadQrGuests.fulfilled, (state, action) => {
            state.status = 'uploadSuccess';
            state.data = action.payload.data;
         })
         .addCase(uploadQrGuests.rejected, (state, action) => {
            state.status = 'uploadSuccess';
            state.error = action.error;
         })
         .addCase(getQrGuests.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getQrGuests.fulfilled, (state, action) => {
            state.status = 'success';
            state.guests = action.payload;
         })
         .addCase(getQrGuests.rejected, (state, action) => {
            state.status = 'idle';
            state.error = action.error;
         });
   },
});

export const { resetQrGuestsStatus, resetQrGuestsData } = clientQrUploadGuestsSLice.actions;

export default clientQrUploadGuestsSLice.reducer;
