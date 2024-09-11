import { createAsyncThunk } from '@reduxjs/toolkit';
import { NextResponse } from 'next/server';

export const uploadQrImage = createAsyncThunk('clientQrUploadImage/uploadQrImage', async (payload: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const upload = await fetch('/api/uploads/qr/images', {
      method: 'POST',
      body: payload,
   });

   if (!upload.ok) {
      throw new Error('Failed to upload image');
   }

   const response = await upload.json();

   return response;
});

export const getQrImages = createAsyncThunk('clientQrUploadImage/getQrImages', async (payload: any) => {
   console.log('payload', payload);
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const images = await fetch(`/api/uploads/qr/images/${payload}`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${getToken.token}`,
         },
      });

      if (!images.ok) {
         throw new Error('Failed to fetch images');
      }

      const response = await images.json();
      console.log('response', response);
      return response;
   } catch (error) {
      return error;
   }
});

export const deleteQrImage = createAsyncThunk('clientQrUploadImage/deleteQrImage', async (payload: any) => {
   console.log('payload', payload);

   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/uploads/qr/images/${payload.clientId}`, {
         method: 'DELETE',
         headers: {
            Authorization: `Bearer ${getToken.token}`,
         },
         body: JSON.stringify({ imageId: payload.imageId }),
      });

      if (!response.ok) {
         return NextResponse.json({ status: 500, error: 'Failed to delete image' }, { status: 500 });
      }

      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});
