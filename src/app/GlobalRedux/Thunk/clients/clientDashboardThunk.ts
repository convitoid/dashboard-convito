import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
      return error;
   }
});

export const filterDataByAnswer = createAsyncThunk('clientDashboard/filterData', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await axios.post(`/api/clients/dashboard/${payload.clientId}/filter`, {
         search_by: payload.search_by,
         value: payload.value,
      });

      console.log(response.data);

      return response.data;
   } catch (error) {
      return error;
   }
});

export const filterDataGlobal = createAsyncThunk('clientDashboard/filterDataGlobal', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      console.log('filterDataGlobal', payload);

      const response = await axios.post(`/api/clients/dashboard/${payload.clientId}/filter`, {
         search_by: payload.search_by,
         is_answer: payload.is_answer,
         value: payload.value,
      });

      // return response.data;
      return response.data;
   } catch (error) {
      return error;
   }
});

export const exportData = createAsyncThunk('clientDashboard/exportData', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      console.log('payload', payload);

      const body = {
         filter_by: payload.filter_by,
      };

      const response = await fetch(`/api/clients/dashboard/${payload.clientId}`, {
         method: 'POST',
         headers: {
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
         body: JSON.stringify(body),
      });

      console.log('response', response);

      const res = await response.json();
      return res;
   } catch (error) {
      return error;
   }
});
