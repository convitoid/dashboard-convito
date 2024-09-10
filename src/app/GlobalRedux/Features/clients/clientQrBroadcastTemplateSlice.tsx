import { createSlice } from '@reduxjs/toolkit';
import {
   createQrBroadcastTemplate,
   deleteQrBroadcastTemplate,
   fetchQrBroadcastTemplate,
   getQrBroadcastTemplateById,
   updateQrBroadcastTemplate,
} from '../../Thunk/clients/clientQrBroadcastTemplate';

interface clientQrBroadcastTemplate {
   datas: any | '';
   data: any | '';
   templates: any | '';
   template: any | '';
   status:
      | 'idle'
      | 'loading'
      | 'success'
      | 'failed'
      | 'getDataIdle'
      | 'getDataLoading'
      | 'getDataSuccess'
      | 'getDataFailed'
      | 'createDataIdle'
      | 'createDataLoading'
      | 'createDataSuccess'
      | 'createDataFailed'
      | 'updateDataIdle'
      | 'updateDataLoading'
      | 'updateDataSuccess'
      | 'updateDataFailed'
      | 'deleteDataIdle'
      | 'deleteDataLoading'
      | 'deleteDataSuccess'
      | 'deleteDataFailed';
   error: any | '';
}

const initialState: clientQrBroadcastTemplate = {
   datas: [],
   data: [],
   templates: [],
   template: [],
   status: 'idle',
   error: null,
};

export const clientQrBroadcastTemplateSlice = createSlice({
   name: 'clientQrBroadcastTemplate',
   initialState,
   reducers: {
      resetStatusQrBroadcastTemplate: (state) => {
         state.status = 'idle';
      },
      resetDataQrBroadcastTemplate: (state) => {
         state.template = [];
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(createQrBroadcastTemplate.pending, (state) => {
            state.status = 'createDataLoading';
         })
         .addCase(createQrBroadcastTemplate.fulfilled, (state, action) => {
            state.status = 'createDataLoading';
            state.datas = action.payload;
         })
         .addCase(createQrBroadcastTemplate.rejected, (state, action) => {
            state.status = 'createDataFailed';
            state.error = action;
         })

         .addCase(fetchQrBroadcastTemplate.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchQrBroadcastTemplate.fulfilled, (state, action) => {
            state.status = 'success';
            state.templates = action.payload;
         })
         .addCase(fetchQrBroadcastTemplate.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action;
         })

         .addCase(getQrBroadcastTemplateById.pending, (state) => {
            state.status = 'getDataLoading';
         })
         .addCase(getQrBroadcastTemplateById.fulfilled, (state, action) => {
            state.status = 'getDataSuccess';
            state.template = action.payload;
         })
         .addCase(getQrBroadcastTemplateById.rejected, (state, action) => {
            state.status = 'getDataFailed';
            state.error = action;
         })

         .addCase(updateQrBroadcastTemplate.pending, (state) => {
            state.status = 'updateDataLoading';
         })
         .addCase(updateQrBroadcastTemplate.fulfilled, (state, action) => {
            state.status = 'updateDataSuccess';
            state.datas = action.payload;
         })
         .addCase(updateQrBroadcastTemplate.rejected, (state, action) => {
            state.status = 'updateDataFailed';
            state.error = action;
         })

         .addCase(deleteQrBroadcastTemplate.pending, (state) => {
            state.status = 'deleteDataLoading';
         })
         .addCase(deleteQrBroadcastTemplate.fulfilled, (state, action) => {
            state.status = 'deleteDataSuccess';
            state.datas = action.payload;
         })
         .addCase(deleteQrBroadcastTemplate.rejected, (state, action) => {
            state.status = 'deleteDataFailed';
            state.error = action;
         });
   },
});

export const { resetStatusQrBroadcastTemplate, resetDataQrBroadcastTemplate } = clientQrBroadcastTemplateSlice.actions;
export default clientQrBroadcastTemplateSlice.reducer;
