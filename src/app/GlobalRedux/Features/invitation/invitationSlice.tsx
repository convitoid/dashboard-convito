import { createSlice } from '@reduxjs/toolkit';
import { getAnswer, getInvitation, updateAnswer } from '../../Thunk/invitation/invitationThunk';

interface Invitation {
   invitations: any | '';
   invitation: any | '';
   status:
      | 'idle'
      | 'loading'
      | 'failed'
      | 'success'
      | 'updateAnswerLoading'
      | 'updateAnswerSuccess'
      | 'updateAnswerFailed'
      | 'getAnswerLoading'
      | 'getAnswerSuccess'
      | 'getAnswerFailed';
   error: any | null;
}

const initialState: Invitation = {
   invitations: [],
   invitation: [],
   status: 'idle',
   error: null,
};

export const invitationSlice = createSlice({
   name: 'invitation',
   initialState,
   reducers: {
      resetStatus: (state) => {
         state.status = 'idle';
      },
   },
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
         })

         .addCase(updateAnswer.pending, (state) => {
            state.status = 'updateAnswerLoading';
         })
         .addCase(updateAnswer.fulfilled, (state, action) => {
            state.status = 'updateAnswerSuccess';
         })
         .addCase(updateAnswer.rejected, (state, action) => {
            state.status = 'updateAnswerFailed';
            state.error = action.error.message;
         })

         .addCase(getAnswer.pending, (state) => {
            state.status = 'getAnswerLoading';
         })
         .addCase(getAnswer.fulfilled, (state, action) => {
            state.status = 'getAnswerSuccess';
            state.invitation = action.payload;
         })
         .addCase(getAnswer.rejected, (state, action) => {
            state.status = 'getAnswerFailed';
            state.error = action.error.message;
         });
   },
});

export const { resetStatus } = invitationSlice.actions;
export default invitationSlice.reducer;
