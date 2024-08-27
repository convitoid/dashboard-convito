import { exportData, getDashboardData } from '@/app/GlobalRedux/Thunk/clients/clientDashboardThunk';
import { createSlice } from '@reduxjs/toolkit';

interface ClientDashboard {
   datas: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success' | 'exportLoading' | 'exportSuccess' | 'exportFailed';
   error: any | null;
}

const initialState: ClientDashboard = {
   datas: [],
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
         });
   },
});

export const { resetStatus, resetData } = clientDashboardSlice.actions;
export default clientDashboardSlice.reducer;
