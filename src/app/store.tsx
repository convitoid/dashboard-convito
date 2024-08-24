'use client';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/app/GlobalRedux/Features/counter/counterSlice';
import userReducer from '@/app/GlobalRedux/Features/user/userSlicer';
import authReducer from '@/app/GlobalRedux/Features/auth/authSlicer';
import testBlastingReducer from '@/app/GlobalRedux/Features/test/testBlastingSlicer';
import clientReducer from '@/app/GlobalRedux/Features/clients/clientSlice';
import clientUploadImage from '@/app/GlobalRedux/Features/clients/clientUploadImageSlice';
import guestReducer from '@/app/GlobalRedux/Features/guests/guestsSlice';
import questionReducer from '@/app/GlobalRedux/Features/question/questionSlice';
import broadcastTemplateReducer from '@/app/GlobalRedux/Features/broadcastTemplate/broadcastTemplateSlice';
import scenarioReducer from '@/app/GlobalRedux/Features/scenario/scenarioSlice';
import videoReducer from '@/app/GlobalRedux/Features/video/videoSlice';

const rootReducer = combineReducers({
   counter: counterReducer,
   users: userReducer,
   auth: authReducer,
   testBlasting: testBlastingReducer,
   clients: clientReducer,
   uploadImage: clientUploadImage,
   guests: guestReducer,
   questions: questionReducer,
   broadcastTemplate: broadcastTemplateReducer,
   scenario: scenarioReducer,
   video: videoReducer,
   //add all your reducers here
});

export const store = configureStore({
   reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
