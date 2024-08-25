import { createSlice } from '@reduxjs/toolkit';
import { getInvitation } from '../../Thunk/invitation/invitationThunk';

interface Invitation {
   invitations: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   error: any | null;
}

const initialState: Invitation = {
   invitations: [],
   status: 'idle',
   error: null,
};

export const invitationSlice = createSlice({
   name: 'invitation',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(getInvitation.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getInvitation.fulfilled, (state, action) => {
            state.status = 'success';
            state.invitations = action.payload;
         })
         .addCase(getInvitation.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export default invitationSlice.reducer;
