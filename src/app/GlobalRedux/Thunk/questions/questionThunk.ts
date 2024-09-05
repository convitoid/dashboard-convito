import { createAsyncThunk } from '@reduxjs/toolkit';

export const getAllQuestions = createAsyncThunk('questions/getAllQuestions', async (clientId: string) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      const response = await fetch(`/api/questions/${clientId}`, {
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
});

export const addQuestion = createAsyncThunk(
   'questions/addQuestion',
   async (payload: { clientId: string; formData: { question: string; type: string } }) => {
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });

         const response = await fetch(`/api/questions/${payload.clientId}`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${getToken.user.jwt}`,
            },
            body: JSON.stringify({
               question: payload.formData.question,
               type: payload.formData.type,
            }),
         });

         const data = await response.json();
         return data;
      } catch (error) {
         return error;
      }
   }
);

export const getQuestionById = createAsyncThunk(
   'questions/getQuestionById',
   async (payload: { clientId: string; questionId: string }) => {
      console.log('payload dari thunk', payload);
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });

         const response = await fetch(`/api/questions/${payload.clientId}/${payload.questionId}`, {
            method: 'GET',
            headers: {
               Authorization: `Bearer ${getToken.user.jwt}`,
            },
         });

         const data = await response.json();
         console.log('data', data);
         return data;
      } catch (error) {
         console.log('error', error);
      }
   }
);

export const updateQuestion = createAsyncThunk(
   'questions/updateQuestion',
   async (payload: { clientId: string; formData: { question: string; type: string; id: string } }) => {
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });

         const response = await fetch(`/api/questions/${payload.clientId}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${getToken.user.jwt}`,
            },
            body: JSON.stringify({
               id: payload.formData.id,
               question: payload.formData.question,
               type: payload.formData.type,
            }),
         });
         const data = await response.json();
         return data;
      } catch (error) {
         console.log('error', error);
      }
   }
);

export const deleteQuestion = createAsyncThunk(
   'questions/deleteQuestion',
   async (payload: { clientId: string; id: string }) => {
      console.log('payload', payload);
      try {
         const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
               return data;
            });

         const response = await fetch(`/api/questions/${payload.clientId}`, {
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
   }
);
