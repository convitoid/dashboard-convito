import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setProgress } from '../../Features/clients/clientQrUploadFileSlice';

export const uploadQrFile = createAsyncThunk(
   'clientQrUploadFile/uploadQrFile',
   async (payload: any, { dispatch, rejectWithValue }) => {
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });

         const config = {
            headers: {
               Authorization: `Bearer ${getToken.token}`,
               'Content-Type': 'multipart/form-data',
            },
         };
         const uploadQrfile = await axios.post('/api/uploads/qr/file', payload, config);
         return uploadQrfile.data;
      } catch (error: any) {
         return rejectWithValue(error.message);
      }
   }
);

export const getQrFiles = createAsyncThunk('clientQrUploadFile/getQrFiles', async (clientId: string) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const qrFiles = await fetch(`/api/qr/${clientId}`, {
         method: 'GET',
         headers: {
            Authorization: `Bearer ${getToken.token}`,
         },
      });

      if (!qrFiles.ok) {
         const errorResponse = await qrFiles.json();
         throw new Error(errorResponse.message || 'Failed to fetch qr files');
      }

      const response = await qrFiles.json();

      return response;
   } catch (error) {
      return error;
   }
});
