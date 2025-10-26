import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGuests = createAsyncThunk('guest/fetchGuest', async (clientId: string) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });
   const response = await fetch('/api/guests', {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: JSON.stringify({
         clientId,
      }),
   });
   const data = await response.json();
   return data;
});

export const uploadGuests = createAsyncThunk('guest/uploadGuest', async (data: any) => {
   const getToken = await fetch('/api/auth/session')
      .then((res) => res.json())
      .then((data) => {
         return data;
      });
   const response = await fetch('/api/uploads/guests', {
      method: 'POST',
      headers: {
         Authorization: `Bearer ${getToken.user.jwt}`,
      },
      body: data,
   });
   const res = await response.json();
   return res;
});

export const updateBroadcastStatus = createAsyncThunk(
   'guest/updateBroadcastStatus', 
   async ({ guestId, excluded }: { guestId: number; excluded: boolean }) => {
      const response = await fetch(`/api/guests/${guestId}/broadcast-status`, {
         method: 'PATCH',
         headers: {
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ excluded })
      });
      
      if (!response.ok) {
         throw new Error('Failed to update broadcast status');
      }
      
      return { guestId, excluded };
   }
);
