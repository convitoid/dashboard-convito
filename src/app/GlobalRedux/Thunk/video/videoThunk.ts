import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllVideo = createAsyncThunk('video/getAllVideo', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/video/${payload.clientId}`, {
         method: 'GET',
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});

export const createVideo = createAsyncThunk('video/createVideo', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/video/${payload.clientId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
         body: JSON.stringify(payload.data),
      });
      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});

export const deleteVideo = createAsyncThunk('video/deleteVideo', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/video/${payload.clientId}`, {
         method: 'DELETE',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
         body: JSON.stringify({
            id: payload.id,
         }),
      });
      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});
