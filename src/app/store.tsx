'use client';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/app/GlobalRedux/Features/counter/counterSlice';
import userReducer from '@/app/GlobalRedux/Features/user/userSlicer';
import authReducer from '@/app/GlobalRedux/Features/auth/authSlicer';
import testBlastingReducer from '@/app/GlobalRedux/Features/test/testBlastingSlicer';
import clientReducer from '@/app/GlobalRedux/Features/clients/clientSlice';
import clientUploadImage from '@/app/GlobalRedux/Features/clients/clientUploadImageSlice';

const rootReducer = combineReducers({
    counter: counterReducer,
    users: userReducer,
    auth: authReducer,
    testBlasting: testBlastingReducer,
    clients: clientReducer,
    uploadImage: clientUploadImage,
    //add all your reducers here
});

export const store = configureStore({
    reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
