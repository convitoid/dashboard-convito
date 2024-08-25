import { createSlice } from '@reduxjs/toolkit';
import {
   createScenario,
   deleteScenario,
   getAllScenario,
   getScenarioById,
   updateScenario,
} from '../../Thunk/scenario/scenarioThunk';

interface Scenario {
   datas: any | '';
   data: any | '';
   scenarioId: string | '';
   isAddScenario: boolean;
   formStatus: '' | 'add' | 'edit';
   status: 'idle' | 'loading' | 'failed' | 'success' | 'deleteLoading' | 'deleteSuccess' | 'deleteFailed';
   error: any | null;
}

const initialState: Scenario = {
   datas: [],
   data: [],
   scenarioId: '',
   formStatus: '',
   isAddScenario: false,
   status: 'idle',
   error: null,
};

export const scenarioSlice = createSlice({
   name: 'scenario',
   initialState,
   reducers: {
      openAddForm: (state) => {
         state.formStatus = 'add';
      },
      openEditForm: (state, action) => {
         state.scenarioId = action.payload;
         state.formStatus = 'edit';
      },
      clearData: (state) => {
         state.data = [];
      },
      resetStatus: (state) => {
         state.status = 'idle';
      },
      setIsAddScenario: (state, action) => {
         state.isAddScenario = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         .addCase(getAllScenario.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getAllScenario.fulfilled, (state, action) => {
            state.status = 'success';
            state.datas = action.payload.data;
         })
         .addCase(getAllScenario.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action;
         })

         .addCase(getScenarioById.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(getScenarioById.fulfilled, (state, action) => {
            state.status = 'success';
            state.data = action.payload.data;
         })
         .addCase(getScenarioById.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action;
         })

         .addCase(createScenario.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(createScenario.fulfilled, (state, action) => {
            state.status = 'success';
         })
         .addCase(createScenario.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action;
         })

         .addCase(updateScenario.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(updateScenario.fulfilled, (state, action) => {
            state.status = 'success';
         })
         .addCase(updateScenario.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action;
         })

         .addCase(deleteScenario.pending, (state) => {
            state.status = 'deleteLoading';
         })
         .addCase(deleteScenario.fulfilled, (state, action) => {
            state.status = 'deleteSuccess';
         })
         .addCase(deleteScenario.rejected, (state, action) => {
            state.status = 'deleteFailed';
            state.error = action;
         });
   },
});

export const { openAddForm, clearData, openEditForm, setIsAddScenario } = scenarioSlice.actions;
export default scenarioSlice.reducer;
