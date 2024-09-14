import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

interface ErrorMessage {
   message: string;
   code: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string; id: string } }) {
   const token = req.headers.get('authorization');
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

      if (!client) {
         logger.info(`Client not found`, {
            error: 'Client not found',
            apiUrl: `/api/video/${params.clientId}`,
         });
         return NextResponse.json(
            {
               status: 404,
               message: 'Client not found',
            },
            { status: 404 }
         );
      }

      const video = await prisma.clientVideo.findFirst({
         where: {
            id: Number(params.id),
            clientId: client?.id,
         },
      });

      if (!video) {
         logger.info(`Video not found`, {
            error: 'Video not found',
            apiUrl: `/api/video/${params.clientId}`,
         });
         return NextResponse.json(
            {
               status: 404,
               message: 'Video not found',
            },
            { status: 404 }
         );
      }

      logger.info(`Video fetched successfully`, {
         data: video,
         apiUrl: `/api/video/${params.clientId}`,
      });

      return NextResponse.json(
         {
            status: 200,
            message: 'Video fetched successfully',
            data: video,
         },
         { status: 200 }
      );
   } catch (error) {
      const errorMessage = error as ErrorMessage;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.info(`Unauthorized`, {
            error: 'Unauthorized',
            apiUrl: `/api/video/${params.clientId}`,
         });
         return NextResponse.json(
            {
               satatus: 401,
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.error(`Failed to fetch video`, {
         error: errorMessage?.message,
         apiUrl: `/api/video/${params.clientId}`,
      });

      return NextResponse.json(
         {
            status: 500,
            message: {
               error: errorMessage?.message,
               code: errorMessage?.code,
            },
         },
         { status: 500 }
      );
   }
}
