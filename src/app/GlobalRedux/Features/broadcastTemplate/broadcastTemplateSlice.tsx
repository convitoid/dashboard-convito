import { createSlice } from '@reduxjs/toolkit';
import {
   createBroadcastTemplate,
   deleteBroadcastTemplate,
   getAllBroadcastTemplates,
   getBroadcastTemplateById,
   updateBroadcastTemplate,
} from '../../Thunk/broadcastTemplate/broadcastTemplateThunk';

interface BroadcastTemplate {
   datas: any | '';
   data: any | '';
   status:
      | 'idle'
      | 'loading'
      | 'failed'
      | 'success'
      | 'addLoading'
      | 'addFailed'
      | 'addSuccess'
      | 'getByIdLoading'
      | 'getByIdFailed'
      | 'getByIdSuccess'
      | 'updateLoading'
      | 'updateFailed'
      | 'updateSuccess'
      | 'deleteLoading'
      | 'deleteFailed'
      | 'deleteSuccess';
   error: any | null;
}

const initialState: BroadcastTemplate = {
   datas: [],
   data: [],
   status: 'idle',
   error: null,
};

export const broadcastTemplateSlice = createSlice({
   name: 'broadcastTemplate',
   initialState,
   reducers: {
      resetStatus: (state) => {
         state.status = 'idle';
      },
      resetData: (state) => {
         state.data = [];
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getAllBroadcastTemplates.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getAllBroadcastTemplates.fulfilled, (state, action) => {
            state.status = 'success';
            state.datas = action.payload.data;
         })
         .addCase(getAllBroadcastTemplates.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action;
         })

         .addCase(createBroadcastTemplate.pending, (state) => {
            state.status = 'addLoading';
         })
         .addCase(createBroadcastTemplate.fulfilled, (state, action) => {
            state.status = 'addSuccess';
            state.data = action.payload.data;
         })
         .addCase(createBroadcastTemplate.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action;
         })

         .addCase(getBroadcastTemplateById.pending, (state) => {
            state.status = 'getByIdLoading';
         })
         .addCase(getBroadcastTemplateById.fulfilled, (state, action) => {
            state.status = 'getByIdSuccess';
            state.data = action.payload.data;
         })
         .addCase(getBroadcastTemplateById.rejected, (state, action) => {
            state.status = 'getByIdFailed';
            state.error = action;
         })

         .addCase(updateBroadcastTemplate.pending, (state) => {
            state.status = 'updateLoading';
         })
         .addCase(updateBroadcastTemplate.fulfilled, (state, action) => {
            state.status = 'updateSuccess';
            state.data = action.payload.data;
         })
         .addCase(updateBroadcastTemplate.rejected, (state, action) => {
            state.status = 'updateFailed';
            state.error = action;
         })

         .addCase(deleteBroadcastTemplate.pending, (state) => {
            state.status = 'deleteLoading';
         })
         .addCase(deleteBroadcastTemplate.fulfilled, (state, action) => {
            state.status = 'deleteSuccess';
            state.data = action.payload.data;
         })
         .addCase(deleteBroadcastTemplate.rejected, (state, action) => {
            state.status = 'deleteFailed';
            state.error = action;
         });
   },
});

export const { resetStatus, resetData } = broadcastTemplateSlice.actions;

export default broadcastTemplateSlice.reducer;
