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
         return NextResponse.json(
            {
               message: 'Question not found',
            },
            { status: 404 }
         );
      }

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
         return NextResponse.json(
            {
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      return NextResponse.json(
         {
            message: "You're not authorized",
         },
         { status: 500 }
      );
   }
}
