import { createSlice } from '@reduxjs/toolkit';
import { createVideo, deleteVideo, getAllVideo } from '../../Thunk/video/videoThunk';

interface Video {
   videos: any[] | '';
   video: any | '';
   status: 'idle' | 'loading' | 'failed' | 'success';
   error: any | null;
}

const initialState: Video = {
   videos: [],
   video: [],
   status: 'idle',
   error: null,
};

export const videoSlice = createSlice({
   name: 'video',
   initialState,
   reducers: {
      clearData: (state) => {
         state.videos = [];
      },
      resetStatus: (state) => {
         state.status = 'idle';
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getAllVideo.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getAllVideo.fulfilled, (state, action) => {
            state.status = 'success';
            state.videos = action.payload.data;
         })
         .addCase(getAllVideo.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(createVideo.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(createVideo.fulfilled, (state, action) => {
            state.status = 'success';
         })
         .addCase(createVideo.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(deleteVideo.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(deleteVideo.fulfilled, (state, action) => {
            state.status = 'success';
         })
         .addCase(deleteVideo.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export const { clearData, resetStatus } = videoSlice.actions;
export default videoSlice.reducer;
