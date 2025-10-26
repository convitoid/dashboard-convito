import { createSlice } from '@reduxjs/toolkit';
import { fetchGuests, uploadGuests, updateBroadcastStatus } from '../../Thunk/guests/guestThunk';

interface Guest {
   guests: any | '';
   guestsUpload: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   statusGuestsUpload: 'idle' | 'loading' | 'failed' | 'success';
   error: any | null;
}

const initialState: Guest = {
   guests: [],
   guestsUpload: [],
   status: 'idle',
   statusGuestsUpload: 'idle',
   error: null,
};

export const guestSlice = createSlice({
   name: 'guest',
   initialState,
   reducers: {
      updateGuestBroadcastStatus: (state, action) => {
         const { guestId, excluded } = action.payload;
         const guestIndex = state.guests.findIndex((guest: any) => guest.id === guestId);
         if (guestIndex !== -1) {
            state.guests[guestIndex].excluded_from_broadcast = excluded;
         }
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(fetchGuests.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchGuests.fulfilled, (state, action) => {
            state.status = 'success';
            state.guests = action.payload.data;
         })
         .addCase(fetchGuests.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })
         .addCase(uploadGuests.pending, (state) => {
            state.statusGuestsUpload = 'loading';
         })
         .addCase(uploadGuests.fulfilled, (state, action) => {
            state.statusGuestsUpload = 'success';
            state.guestsUpload = action.payload;
         })
         .addCase(uploadGuests.rejected, (state, action) => {
            state.statusGuestsUpload = 'failed';
            state.error = action.error.message;
         })
         .addCase(updateBroadcastStatus.fulfilled, (state, action) => {
            const { guestId, excluded } = action.payload;
            const guestIndex = state.guests.findIndex((guest: any) => guest.id === guestId);
            if (guestIndex !== -1) {
               state.guests[guestIndex].excluded_from_broadcast = excluded;
            }
         });
   },
});

export const { updateGuestBroadcastStatus } = guestSlice.actions;
export default guestSlice.reducer;
