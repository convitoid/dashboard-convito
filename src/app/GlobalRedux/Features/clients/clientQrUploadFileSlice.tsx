import { createSlice } from '@reduxjs/toolkit';
import { getQrFiles, uploadQrFile } from '../../Thunk/clients/clientQrUploadFileThunk';

interface ClientQrUploadFile {
   files: any | '';
   datas: any | '';
   progress: number;
   status:
      | 'idle'
      | 'loading'
      | 'failed'
      | 'success'
      | 'uploadIdle'
      | 'uploadLoading'
      | 'uploadSuccess'
      | 'uploadFailed';
   error: any | null;
   isOpenModal: boolean;
}

const initialState: ClientQrUploadFile = {
   files: [],
   datas: [],
   progress: 0,
   status: 'idle',
   error: null,
   isOpenModal: false,
};

export const clientQrUploadFileSlice = createSlice({
   name: 'clientQrUploadFile',
   initialState,
   reducers: {
      resetStatusQr: (state) => {
         state.status = 'idle';
      },
      resetDataFiles: (state) => {
         state.files = [];
      },
      setProgress: (state, action) => {
         state.progress = action.payload;
      },
      setIsOpenModal: (state) => {
         state.isOpenModal = true;
      },
      setIsCloseModal: (state) => {
         state.isOpenModal = false;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(uploadQrFile.pending, (state) => {
            state.status = 'uploadLoading';
         })
         .addCase(uploadQrFile.fulfilled, (state, action) => {
            state.status = 'uploadSuccess';
            state.files = action.payload;
         })
         .addCase(uploadQrFile.rejected, (state, action) => {
            state.status = 'uploadFailed';
            state.error = action.error.message;
         })

         .addCase(getQrFiles.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getQrFiles.fulfilled, (state, action) => {
            state.status = 'success';
            state.files = action.payload.data;
         })
         .addCase(getQrFiles.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         });
   },
});

export const { resetStatusQr, resetDataFiles, setProgress, setIsOpenModal, setIsCloseModal } =
   clientQrUploadFileSlice.actions;
export default clientQrUploadFileSlice.reducer;
