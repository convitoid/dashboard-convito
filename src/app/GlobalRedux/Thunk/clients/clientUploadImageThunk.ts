import { createAsyncThunk } from '@reduxjs/toolkit';

export const uploadImage = createAsyncThunk(
    'clientUploadImage/uploadImage',
    async (data: any) => {
        const getToken = await fetch('/api/auth/session')
            .then((res) => res.json())
            .then((data) => {
                return data;
            });

        const upload = await fetch('/api/uploads/images', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${getToken.user.jwt}`,
            },
            body: data,
        });

        const response = await upload.json();
        return response;
    }
);
