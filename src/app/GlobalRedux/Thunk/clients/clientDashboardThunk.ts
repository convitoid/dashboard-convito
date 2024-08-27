import { createAsyncThunk } from '@reduxjs/toolkit';

export const getDashboardData = createAsyncThunk('clientDashboard/getDashboardData', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/clients/dashboard/${payload.clientId}`, {
         method: 'GET',
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
      });
      const res = await response.json();
      return res;
   } catch (error) {
      console.log('error', error);
   }
});

export const exportData = createAsyncThunk('clientDashboard/exportData', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const body = {
         data: payload.data,
      };

      const response = await fetch(`/api/clients/dashboard/${payload.clientId}`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
         body: JSON.stringify(body),
      });

      const res = await response.json();
      return res;
   } catch (error) {
      console.log('error', error);
   }
});
