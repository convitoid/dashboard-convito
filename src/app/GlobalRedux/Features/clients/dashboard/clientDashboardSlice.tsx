import {
   exportData,
   filterDataByAnswer,
   filterDataGlobal,
   getDashboardData,
} from '@/app/GlobalRedux/Thunk/clients/clientDashboardThunk';
import { createSlice } from '@reduxjs/toolkit';

interface ClientDashboard {
   datas: any | '';
   answeredGuests: any | '';
   notAnsweredGuests: any | '';
   totalGuests: any | '';
   guestConfirm: any | '';
   guestDecline: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success' | 'exportLoading' | 'exportSuccess' | 'exportFailed';
   error: any | null;
}

const initialState: ClientDashboard = {
   datas: [],
   answeredGuests: '',
   notAnsweredGuests: '',
   totalGuests: '',
   guestConfirm: '',
   guestDecline: '',
   status: 'idle',
   error: null,
};

export const clientDashboardSlice = createSlice({
   name: 'clientDashboard',
   initialState,
   reducers: {
      resetStatus: (state) => {
         state.status = 'idle';
      },
      resetData: (state) => {
         state.datas = [];
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getDashboardData.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getDashboardData.fulfilled, (state, action) => {
            state.status = 'success';
            state.datas = action.payload.data;
            state.answeredGuests = action.payload?.data[0]?.answered_guest;
            state.notAnsweredGuests = action.payload?.data[0]?.not_answered_guest;
            state.totalGuests = action.payload?.data[0]?.total_guests;
            state.guestConfirm = action.payload?.data[0]?.guest_confirm;
            state.guestDecline = action.payload?.data[0]?.guest_decline;
         })
         .addCase(getDashboardData.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(exportData.pending, (state) => {
            state.status = 'exportLoading';
         })
         .addCase(exportData.fulfilled, (state) => {
            state.status = 'exportSuccess';
         })
         .addCase(exportData.rejected, (state) => {
            state.status = 'exportFailed';
         })

         .addCase(filterDataByAnswer.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(filterDataByAnswer.fulfilled, (state, action) => {
            state.status = 'success';
            state.datas = action.payload.data;
         })
         .addCase(filterDataByAnswer.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(filterDataGlobal.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(filterDataGlobal.fulfilled, (state, action) => {
            state.status = 'success';
            state.datas = action.payload.data;
         })
         .addCase(filterDataGlobal.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export const { resetStatus, resetData } = clientDashboardSlice.actions;
export default clientDashboardSlice.reducer;
