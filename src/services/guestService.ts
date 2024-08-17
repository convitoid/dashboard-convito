import prisma from '@/libs/prisma';
import { getErrorResponse, getSuccessReponse } from '@/utils/response/successResponse';
import { jwtVerify } from 'jose';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export const getGuests = async (jwtToken: string, clientId: string) => {
   try {
      const { payload } = await jwtVerify(jwtToken, secret);

      const clients = await prisma.client.findFirst({
         where: {
            client_id: clientId,
         },
      });

      const guests = await prisma.guest.findMany({
         where: {
            clientId: clients?.id,
         },
         include: {
            GuestDetail: true,
         },
      });

      return getSuccessReponse(guests, 200, 'Fetch guests successfully');
   } catch (error) {
      const jwtError = error as JWTError;
      if (jwtError.code === 'ERR_JWT_EXPIRED') {
         return getErrorResponse(error as string, 401);
      }
      return getErrorResponse('Failed to fetch clients', 500);
   }
};
