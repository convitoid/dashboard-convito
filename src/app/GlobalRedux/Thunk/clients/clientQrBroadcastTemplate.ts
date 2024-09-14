import { createAsyncThunk } from '@reduxjs/toolkit';

export const createQrBroadcastTemplate = createAsyncThunk('client/createQrBroadcastTemplate', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const jsonData = {
         clientId: payload.clientId,
         formData: payload.formData,
      };

      const response = await fetch(`/api/qr/broadcast-template`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(jsonData),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});

export const fetchQrBroadcastTemplate = createAsyncThunk('client/fetchQrBroadcastTemplate', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const jsonData = {
         clientId: payload.clientId,
      };

      const response = await fetch(`/api/qr/broadcast-template/${payload.clientId}`, {
         method: 'GET',
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
            'Content-Type': 'application/json',
         },
      });

      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});

export const getQrBroadcastTemplateById = createAsyncThunk(
   'client/getQrBroadcastTemplateById',
   async (payload: any) => {
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });

         if (payload.templateId) {
            const response = await fetch(`/api/qr/broadcast-template/${payload.clientId}/${payload.templateId}`, {
               method: 'GET',
               headers: {
                  Authorization: `Bearer ${getToken.user.jwt}`,
                  'Content-Type': 'application/json',
               },
            });
            const data = await response.json();
            return data;
         }
      } catch (error) {
         return error;
      }
   }
);

export const updateQrBroadcastTemplate = createAsyncThunk('client/updateQrBroadcastTemplate', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const jsonData = {
         clientId: payload.clientId,
         id: payload.id,
         name: payload.template_name,
         type: payload.template_type,
      };

      const response = await fetch(`/api/qr/broadcast-template/${payload.clientId}`, {
         method: 'PUT',
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(jsonData),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});

export const deleteQrBroadcastTemplate = createAsyncThunk('client/deleteQrBroadcastTemplate', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const jsonData = {
         clientId: payload.clientId,
         id: payload.templateId,
      };

      const response = await fetch(`/api/qr/broadcast-template/${payload.clientId}`, {
         method: 'DELETE',
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(jsonData),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      return error;
   }
});
