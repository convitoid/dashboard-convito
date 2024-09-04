import { createAsyncThunk } from '@reduxjs/toolkit';

export const uploadQrFile = createAsyncThunk('clientQrUploadFile/uploadQrFile', async (payload: any) => {
   console.log(payload);
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const uploadQrFile = await fetch(`/api/uploads/qr/file`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${getToken.token}`,
         },
         body: payload,
      });

      if (!uploadQrFile.ok) {
         const errorResponse = await uploadQrFile.json();
         throw new Error(errorResponse.message || 'Failed to upload file');
      }

      const response = await uploadQrFile.json();
      return response;
   } catch (error: any) {
      // Return a serializable error object
      return { message: error.message };
   }
});

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
