import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
   fetchClients,
   createCLient,
   deleteClient,
   getClientById,
   updateClient,
} from '@/app/GlobalRedux/Thunk/clients/clientThunk';

interface Client {
   clients: any | '';
   client: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   statusAdd: 'idle' | 'loading' | 'failed' | 'success';
   statusGetId: 'idle' | 'loading' | 'failed' | 'success';
   statusUpdate: 'idle' | 'loading' | 'failed' | 'success';
   error: any | null;
}

const initialState: Client = {
   clients: [],
   client: [],
   status: 'idle',
   statusAdd: 'idle',
   statusGetId: 'idle',
   statusUpdate: 'idle',
   error: null,
};

export const clientSlice = createSlice({
   name: 'client',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchClients.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchClients.fulfilled, (state, action) => {
            state.status = 'success';
            state.clients = action.payload.data;
         })
         .addCase(fetchClients.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(getClientById.pending, (state) => {
            state.statusGetId = 'loading';
         })
         .addCase(getClientById.fulfilled, (state, action) => {
            state.statusGetId = 'success';
            state.client = action.payload.data;
         })
         .addCase(getClientById.rejected, (state, action) => {
            state.statusGetId = 'failed';
            state.error = action.error.message;
         })

         .addCase(updateClient.pending, (state) => {
            state.statusUpdate = 'loading';
         })
         .addCase(updateClient.fulfilled, (state, action) => {
            state.statusUpdate = 'success';
            state.client = action.payload.data;
         })
         .addCase(updateClient.rejected, (state, action) => {
            state.statusUpdate = 'failed';
            state.error = action.error.message;
         })

         .addCase(createCLient.pending, (state) => {
            state.statusAdd = 'loading';
         })
         .addCase(createCLient.fulfilled, (state, action) => {
            state.statusAdd = 'success';
            state.client = action.payload.data;
         })
         .addCase(createCLient.rejected, (state, action) => {
            state.statusAdd = 'failed';
            state.error = action.error.message;
         })

         .addCase(deleteClient.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(deleteClient.fulfilled, (state, action) => {
            state.status = 'success';
            state.client = action.payload.data;
         })
         .addCase(deleteClient.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export default clientSlice.reducer;
