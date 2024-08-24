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
         return NextResponse.json(
            {
               status: 404,
               message: 'Video not found',
            },
            { status: 404 }
         );
      }

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
         return NextResponse.json(
            {
               satatus: 401,
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

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
