import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string; id: string } }) {
   const token = req.headers.get('Authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      const response = await prisma.broadcastTemplate.findUnique({
         where: {
            id: Number(params.id),
            client_id: Number(client?.id),
         },
      });

      if (!response) {
         logger.error(`Broadcast template not found`, {
            broadcastTemplateId: params.id,
            clientId: params.clientId,
            apiUrl: `/api/broadcast-template/${params.clientId}/${params.id}`,
         });
         return NextResponse.json(
            {
               status: 404,
               message: 'not found',
            },
            { status: 404 }
         );
      }

      logger.info(`Broadcast template fetched successfully for client: ${params.clientId}`, {
         data: response,
      });

      return NextResponse.json(
         {
            status: 'success',
            data: response,
         },
         { status: 200 }
      );
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`Unauthorized access`, {
            data: errorMessage.message,
         });
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.error(`Error fetching broadcast template for client: ${params.clientId}`, {
         data: errorMessage.message,
      });

      return NextResponse.json(
         {
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}
