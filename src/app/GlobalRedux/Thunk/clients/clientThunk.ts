import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchClients = createAsyncThunk('client/fetchClients', async () => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const response = await fetch('/api/clients', {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
   });

   const data = await response.json();
   return data;
});

export const createCLient = createAsyncThunk('client/createClient', async (values: any) => {
   console.log('values from thunk', values);
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((values) => {
         return values;
      });
   const response = await fetch('/api/clients', {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify(values),
   });
   const data = await response.json();
   return data;
});

export const getClientById = createAsyncThunk('client/getClientById', async (id: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((values) => {
         return values;
      });
   const response = await fetch(`/api/clients/${id}`, {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
   });
   const data = await response.json();
   return data;
});

export const updateClient = createAsyncThunk('client/updateClient', async (data: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((values) => {
         return values;
      });
   console.log('data from thunk', data);

   return data;
});

export const deleteClient = createAsyncThunk('client/deleteClient', async (id: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((values) => {
         return values;
      });
   const response = await fetch(`/api/clients/`, {
      method: 'DELETE',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify({
         client_id: id,
      }),
   });
   const data = await response.json();
   console.log('data from thunk', data);
   return data;
});
