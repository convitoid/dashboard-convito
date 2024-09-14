import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllScenario = createAsyncThunk('scenario/getAllScenario', async (clientId: string) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/scenario/${clientId}`, {
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

export const getScenarioById = createAsyncThunk('scenario/getScenarioById', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/scenario/${payload.clientId}/${payload.scenarioId}`, {
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

export const createScenario = createAsyncThunk('scenario/createScenario', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/scenario`, {
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

export const updateScenario = createAsyncThunk('scenario/updateScenario', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });
      const response = await fetch(`/api/scenario`, {
         method: 'PUT',
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

export const deleteScenario = createAsyncThunk('scenario/deleteScenario', async (payload: any) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });
      const response = await fetch(`/api/scenario/${payload.clientId}`, {
         method: 'DELETE',
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
