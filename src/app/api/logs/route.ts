import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function POST(req: NextRequest) {
   const { guest_id, status, message } = await req.json();
   const token = req.headers.get('Authorization');
   const jwtToken = token?.split(' ')[1];

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);
      const log = await prisma.sendBlastingLogs.create({
         data: {
            guestId: Number(guest_id),
            status: status,
            logs: message,
         },
      });

      return NextResponse.json(
         {
            status: 200,
            message: 'log blasting message created',
            data: log,
         },
         { status: 200 }
      );
   } catch (error) {
      const errorMessage = error as Error;
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
            status: 500,
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}
