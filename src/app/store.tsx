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
import sendBlastingReducer from '@/app/GlobalRedux/Features/sendBlasting/sendBlastingSlice';
import invitationReducers from '@/app/GlobalRedux/Features/invitation/invitationSlice';
import clientDashboardReducers from '@/app/GlobalRedux/Features/clients/dashboard/clientDashboardSlice';
import sendBlastingLogsReducers from '@/app/GlobalRedux/Features/logs/sendBlastingLogsSlice';
import clientQrUploadImageReducer from '@/app/GlobalRedux/Features/clients/clientQrUploadImageSlice';
import clientQrUploadFileReducer from '@/app/GlobalRedux/Features/clients/clientQrUploadFileSlice';
import clientQrUploadGuestsReducer from '@/app/GlobalRedux/Features/clients/clientQrUploadGuestsSlice';
import clientQrBroadcastTemplate from '@/app/GlobalRedux/Features/clients/clientQrBroadcastTemplateSlice';
import sendQrSendBlastingReducer from '@/app/GlobalRedux/Features/sendBlasting/sendQrBlastingSlice';
import clientQrDashboardReducer from '@/app/GlobalRedux/Features/clients/qr/dashboard/clientQrDashboardSlice';

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
   sendBlasting: sendBlastingReducer,
   invitations: invitationReducers,
   clientDashboard: clientDashboardReducers,
   sendBlastingLogs: sendBlastingLogsReducers,
   clientQrUploadImage: clientQrUploadImageReducer,
   clientQrUploadFile: clientQrUploadFileReducer,
   clientQrUploadGuests: clientQrUploadGuestsReducer,
   clientQrBroadcastTemplate: clientQrBroadcastTemplate,
   sendQrBlasting: sendQrSendBlastingReducer,
   clientQrDashboard: clientQrDashboardReducer,
   //add all your reducers here
});

export const store = configureStore({
   reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
