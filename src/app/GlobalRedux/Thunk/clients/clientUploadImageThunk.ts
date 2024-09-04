import { createAsyncThunk } from '@reduxjs/toolkit';

export const getClientImages = createAsyncThunk('clientUploadImage/getClientImages', async (clientId: string) => {
   console.log('clientId thunk', clientId);
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const getClientById = await fetch(`/api/clients/${clientId}`, {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
   });

   const client = await getClientById.json();
   const clientImages = await fetch(`/api/uploads/images/${client.data.id}`, {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
   });

   const images = await clientImages.json();
   return images;
});

export const uploadImage = createAsyncThunk('clientUploadImage/uploadImage', async (data: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const upload = await fetch('/api/uploads/images', {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: data,
   });

   const response = await upload.json();
   return response;
});

export const deleteImage = createAsyncThunk('clientUploadImage/deleteImage', async (id: any) => {
   console.log('id', id);
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const deleteImage = await fetch('/api/uploads/images', {
      method: 'DELETE',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify({ clientId: id }),
   });

   const response = await deleteImage.json();
   return response;
});
