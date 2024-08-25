import { createSlice } from '@reduxjs/toolkit';
import {
   addQuestion,
   deleteQuestion,
   getAllQuestions,
   getQuestionById,
   updateQuestion,
} from '../../Thunk/questions/questionThunk';

interface Question {
   questions: any | '';
   question: any | '';
   questionById: any | '';
   questionUpdate: any | '';
   questionDelete: any | '';
   isModalEditQuestionOpen: boolean;
   status: 'idle' | 'loading' | 'failed' | 'success';
   statusAdd: 'idle' | 'loading' | 'failed' | 'success';
   statusGetById: 'idle' | 'loading' | 'failed' | 'success';
   statusUpdate: 'idle' | 'loading' | 'failed' | 'success';
   statusDelete: 'idle' | 'loading' | 'failed' | 'success';
   error: any | null;
}

const initialState: Question = {
   questions: [],
   question: [],
   questionById: [],
   questionUpdate: [],
   questionDelete: [],
   isModalEditQuestionOpen: false,
   status: 'idle',
   statusAdd: 'idle',
   statusGetById: 'idle',
   statusUpdate: 'idle',
   statusDelete: 'idle',
   error: null,
};

export const questionSlice = createSlice({
   name: 'question',
   initialState,
   reducers: {
      openModalEditQuestionAction: (state) => {
         state.isModalEditQuestionOpen = true;
      },
      closeModalEditQuestionAction: (state) => {
         state.isModalEditQuestionOpen = false;
         state.questionById = [];
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getAllQuestions.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getAllQuestions.fulfilled, (state, action) => {
            state.status = 'success';
            state.questions = action.payload.data;
         })
         .addCase(getAllQuestions.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(addQuestion.pending, (state) => {
            state.statusAdd = 'loading';
         })
         .addCase(addQuestion.fulfilled, (state, action) => {
            state.statusAdd = 'success';
            state.question = action.payload;
         })
         .addCase(addQuestion.rejected, (state, action) => {
            state.statusAdd = 'failed';
            state.error = action.error.message;
         })

         .addCase(getQuestionById.pending, (state) => {
            state.statusGetById = 'loading';
         })
         .addCase(getQuestionById.fulfilled, (state, action) => {
            state.statusGetById = 'success';
            state.questionById = action.payload.data;
         })
         .addCase(getQuestionById.rejected, (state, action) => {
            state.statusGetById = 'failed';
            state.error = action.error.message;
         })

         .addCase(updateQuestion.pending, (state) => {
            state.statusUpdate = 'loading';
         })
         .addCase(updateQuestion.fulfilled, (state, action) => {
            state.statusUpdate = 'success';
            state.questionUpdate = action.payload.data;
         })
         .addCase(updateQuestion.rejected, (state, action) => {
            state.statusUpdate = 'failed';
            state.error = action.error.message;
         })

         .addCase(deleteQuestion.pending, (state) => {
            state.statusDelete = 'loading';
         })
         .addCase(deleteQuestion.fulfilled, (state, action) => {
            state.statusDelete = 'success';
            state.questionDelete = action.payload.data;
         })
         .addCase(deleteQuestion.rejected, (state, action) => {
            state.statusDelete = 'failed';
            state.error = action.error.message;
         });
   },
});

export const { openModalEditQuestionAction, closeModalEditQuestionAction } = questionSlice.actions;
export default questionSlice.reducer;
