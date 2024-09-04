import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllBroadcastTemplates = createAsyncThunk(
   'broadcastTemplate/getAllBroadcastTemplates',
   async (clientId: string) => {
      console.log('dari thunk', clientId);
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });
         const response = await fetch(`/api/broadcast-template/${clientId}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${getToken.user.jwt}`,
            },
         });
         const data = await response.json();
         return data;
      } catch (error) {
         console.log('error', error);
      }
   }
);

export const createBroadcastTemplate = createAsyncThunk(
   'broadcastTemplate/createBroadcastTemplate',
   async (data: any) => {
      console.log('data', data);
      const jsonBody = {
         name: data.formData.template_name,
         template_type: data.formData.template_type,
      };
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });
         const response = await fetch(`/api/broadcast-template/${data.clientId}`, {
            method: 'POST',
            headers: {
               Authorization: `Bearer ${getToken.user.jwt}`,
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonBody),
         });
         const res = await response.json();
         return res;
      } catch (error) {
         console.log('error', error);
      }
   }
);

export const getBroadcastTemplateById = createAsyncThunk(
   'broadcastTemplate/getBroadcastTemplateById',
   async (data: any) => {
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });
         const response = await fetch(`/api/broadcast-template/${data.clientId}/${data.id}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${getToken.user.jwt}`,
            },
         });
         const res = await response.json();
         console.log('res', res);
         return res;
      } catch (error) {
         console.log('error', error);
      }
   }
);

export const updateBroadcastTemplate = createAsyncThunk(
   'broadcastTemplate/updateBroadcastTemplate',
   async (data: any) => {
      const jsonBody = {
         id: data.formData.id,
         name: data.formData.template_name,
         template_type: data.formData.template_type,
      };

      console.log('data', data);
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });
         const response = await fetch(`/api/broadcast-template/${data.clientId}`, {
            method: 'PUT',
            headers: {
               Authorization: `Bearer ${getToken.user.jwt}`,
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(jsonBody),
         });
         const res = await response.json();
         return res;
      } catch (error) {
         console.log('error', error);
      }
   }
);

export const deleteBroadcastTemplate = createAsyncThunk(
   'broadcastTemplate/deleteBroadcastTemplate',
   async (data: any) => {
      console.log('data', data);
      const jsonBody = {
         id: data.id,
      };
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });
         const response = await fetch(`/api/broadcast-template/${data.clientId}`, {
            method: 'DELETE',
            headers: {
               Authorization: `Bearer ${getToken.user.jwt}`,
            },
            body: JSON.stringify(jsonBody),
         });
         const res = await response.json();
         return res;
      } catch (error) {
         console.log('error', error);
      }
   }
);
