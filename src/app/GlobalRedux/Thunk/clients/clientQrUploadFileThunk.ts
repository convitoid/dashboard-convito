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
      console.log(response);
      return response;
   } catch (error: any) {
      // Return a serializable error object
      return { message: error.message };
   }
});
