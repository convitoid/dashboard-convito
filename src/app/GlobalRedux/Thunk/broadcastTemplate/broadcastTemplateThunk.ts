import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllBroadcastTemplates = createAsyncThunk(
   'broadcastTemplate/getAllBroadcastTemplates',
   async (clientId: string) => {
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
         return error;
      }
   }
);

export const createBroadcastTemplate = createAsyncThunk(
   'broadcastTemplate/createBroadcastTemplate',
   async (data: any) => {
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
         return error;
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

         return res;
      } catch (error) {
         return error;
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
         return error;
      }
   }
);

export const deleteBroadcastTemplate = createAsyncThunk(
   'broadcastTemplate/deleteBroadcastTemplate',
   async (data: any) => {
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
         return error;
      }
   }
);
