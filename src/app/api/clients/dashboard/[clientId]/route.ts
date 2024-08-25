import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
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

      const guest = await prisma.guest.findMany({
         select: {
            id: true,
            guestId: true,
            name: true,
            scenario: true,
            scenario_slug: true,
            clientId: true,
            Invitations: {
               select: {
                  id: true,
                  clientId: true,
                  guestId: true,
                  questionId: true,
                  answer: true,
               },
            },
         },
         where: {
            clientId: client?.id,
         },
      });

      const answeredGuests = guest.filter((guest) =>
         guest.Invitations.some((invitation) => invitation.answer !== null)
      );

      const answeredGuestsCount = answeredGuests.length;

      const notAnsweredGuests = guest.filter((guest) =>
         guest.Invitations.some((invitation) => invitation.answer === null)
      );

      const notAnsweredGuestsCount = notAnsweredGuests.length;

      const statisticData = [
         {
            client_id: client?.id,
            answered_guest: answeredGuestsCount,
            not_answered_guest: notAnsweredGuestsCount,
            total_guests: guest.length,
            guest: guest,
         },
      ];

      return NextResponse.json(
         {
            status: 200,
            message: 'Dashboard data fetched successfully',
            data: statisticData,
         },
         { status: 200 }
      );
   } catch (error) {
      const errorMessage = error as Error;
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
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}
