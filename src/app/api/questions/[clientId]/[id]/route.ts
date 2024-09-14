import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string; id: string } }) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const getClientById = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      if (!getClientById) {
         logger.error(`Client not found`, {
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}/${params.id}`,
         });
         return NextResponse.json(
            {
               message: 'Client not found',
            },
            { status: 404 }
         );
      }

      const question = await prisma.question.findFirst({
         where: {
            id: Number(params.id),
            client_id: getClientById.id,
         },
      });

      if (!question) {
         logger.error(`Question not found`, {
            questionId: params.id,
            clientId: params.clientId,
            apiUrl: `/api/questions/${params.clientId}/${params.id}`,
         });
         return NextResponse.json(
            {
               message: 'Question not found',
            },
            { status: 404 }
         );
      }

      logger.info(`Question fetched successfully for client: ${params.clientId}`, {
         apiUrl: `/api/questions/${params.clientId}/${params.id}`,
         data: question,
      });

      return NextResponse.json(
         {
            status: 'success',
            message: 'Question fetched successfully',
            data: question,
         },
         { status: 200 }
      );
   } catch (error) {
      // const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`Unauthorized access`, {
            error: jwtError.message,
            apiUrl: `/api/questions/${params.clientId}/${params.id}`,
         });
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.error(`Error fetching question for client: ${params.clientId}`, {
         error: jwtError.message,
         apiUrl: `/api/questions/${params.clientId}/${params.id}`,
      });

      return NextResponse.json(
         {
            message: "You're not authorized",
         },
         { status: 500 }
      );
   }
}
