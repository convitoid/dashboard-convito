import { fetchClientQrDashboard } from '@/app/GlobalRedux/Thunk/clients/clientQrDashboardThunk';
import { createSlice } from '@reduxjs/toolkit';

interface ClientQrDashboardState {
   datas: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   error: any | null;
}

const initialState: ClientQrDashboardState = {
   datas: [],
   status: 'idle',
   error: null,
};

export const clientQrDasboardSlice = createSlice({
   name: 'clientQrDashboard',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchClientQrDashboard.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchClientQrDashboard.fulfilled, (state, action) => {
            state.status = 'success';
            state.datas = action.payload;
         })
         .addCase(fetchClientQrDashboard.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export default clientQrDasboardSlice.reducer;
