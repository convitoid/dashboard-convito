import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface User {
   users: any[] | '';
   user: object | '';
   userStatus: 'idle' | 'loading' | 'failed' | 'success';
   status: 'idle' | 'loading' | 'failed' | 'success';
   error: any | null;
}

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
   });

   const data = await response.json();
   return data;
});

export const createUser = createAsyncThunk('user/createUser', async (data: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const response = await fetch('/api/users', {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify(data),
   });

   const res = await response.json();
   return res;
});

export const findUserById = createAsyncThunk('user/findUserById', async (id: number) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const response = await fetch(`/api/users/${id}`, {
      method: 'GET',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
   });

   const data = await response.json();
   return data;
});

export const updateUser = createAsyncThunk('user/updateUser', async (data: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const response = await fetch('/api/users', {
      method: 'PUT',
      headers: {
         'Content-Type': 'application/json',
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify(data),
   });

   const res = await response.json();
   return res;
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id: number) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });

   const response = await fetch(`/api/users`, {
      method: 'DELETE',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify({ id: id }),
   });

   const data = await response.json();
   return data;
});

const initialState: User = {
   users: [],
   user: {},
   userStatus: 'idle',
   status: 'idle',
   error: null,
};

export const userSlice = createSlice({
   name: 'user',
   initialState,
   reducers: {},
   extraReducers: (builder) => {
      builder
         .addCase(fetchUsers.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = 'success';
            state.users = action.payload.data;
         })
         .addCase(fetchUsers.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(createUser.pending, (state) => {
            state.status = 'loading';
         })
         .addCase(createUser.fulfilled, (state, action) => {
            state.status = 'success';
            state.users = action.payload.data;
         })
         .addCase(createUser.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error.message;
         })

         .addCase(findUserById.pending, (state) => {
            state.userStatus = 'loading';
         })
         .addCase(findUserById.fulfilled, (state, action) => {
            state.userStatus = 'success';
            state.user = action.payload.data;
         })
         .addCase(findUserById.rejected, (state, action) => {
            state.userStatus = 'failed';
            state.error = action.error.message;
         })

         .addCase(updateUser.pending, (state) => {
            state.userStatus = 'loading';
         })
         .addCase(updateUser.fulfilled, (state, action) => {
            state.userStatus = 'success';
            state.user = action.payload.data;
         })
         .addCase(updateUser.rejected, (state, action) => {
            state.userStatus = 'failed';
            state.error = action.error.message;
         })

         .addCase(deleteUser.pending, (state) => {
            state.userStatus = 'loading';
         })

         .addCase(deleteUser.fulfilled, (state) => {
            state.userStatus = 'success';
         })

         .addCase(deleteUser.rejected, (state, action) => {
            state.userStatus = 'failed';
            state.error = action.error.message;
         });
   },
});

export default userSlice.reducer;
