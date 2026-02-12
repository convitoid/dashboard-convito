import { createAsyncThunk } from '@reduxjs/toolkit';

type BlastType = 'reminder' | 'qr_code' | 'both';

interface SendQrBlastingPayload {
   clientId: string;
   data: any[];
   blastType?: BlastType;
}

export const sendQrBlasting = createAsyncThunk('sendBlasting/sendQrBlasting', async (payload: SendQrBlastingPayload) => {
   try {
      const getToken = await fetch('/api/auth/session')
         .then((res) => res.json())
         .then((data) => {
            return data;
         });

      // Support both old format (array) and new format (object with guests and blastType)
      const requestBody = payload.blastType 
         ? { guests: payload.data, blastType: payload.blastType }
         : payload.data;

      const response = await fetch(`/api/send-blasting/qr/${payload.clientId}`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getToken.user.jwt}`,
         },
         body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      return data;
   } catch (error) {
      const errorMessage = error as Error;
      return errorMessage;
   }
});
