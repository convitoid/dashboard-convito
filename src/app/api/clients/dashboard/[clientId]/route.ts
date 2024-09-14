import logger from '@/libs/logger';
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
            SendBlastingLogs: true,
         },
         where: {
            clientId: client?.id,
         },
      });

      const answeredGuests = guest.filter((guest) =>
         guest.Invitations.some((invitation) => invitation.answer !== null)
      );

      const answeredGuestsCount = answeredGuests.length;

      const notAnsweredGuests = guest.filter((guest) => {
         // Count the number of unanswered invitations
         const unansweredCount = guest.Invitations.filter((invitation) => invitation.answer === null).length;

         // Count the number of "no" answers
         const noCount = guest.Invitations.filter((invitation) => invitation.answer === 'no').length;

         // Adjust the unanswered count based on the "no" answers
         const adjustedUnansweredCount = unansweredCount - 2 * noCount;

         // Keep guests where the adjusted unanswered count is greater than 0
         return adjustedUnansweredCount > 0;
      });

      const totalGuestConfirmYes = guest.filter((guest) =>
         guest.Invitations.some((invitation) => invitation.answer === 'yes')
      );

      const guestConfirm = totalGuestConfirmYes.length;

      const totalGuestConfirmNo = guest.filter((guest) =>
         guest.Invitations.some((invitation) => invitation.answer === 'no')
      );

      const guestDecline = totalGuestConfirmNo.length;

      const notAnsweredGuestsCount = notAnsweredGuests.length;

      const statisticData = [
         {
            client_id: client?.id,
            answered_guest: answeredGuestsCount,
            not_answered_guest: notAnsweredGuestsCount,
            total_guests: guest.length,
            guest_confirm: guestConfirm,
            guest_decline: guestDecline,
            guest: guest,
         },
      ];

      logger.info(`Dashboard data fetched successfully for client: ${params.clientId}`, {
         data: statisticData,
      });

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
         logger.error(`Failed to fetch dashboard data for client: ${params.clientId}`, {
            error: 'Unauthorized',
            timestamp: new Date().toISOString(),
         });
         return NextResponse.json(
            {
               satatus: 401,
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.error(`Failed to fetch dashboard data for client: ${params.clientId}`, {
         error: errorMessage.message,
         timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
         {
            status: 500,
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}

export async function POST(req: NextRequest, { params }: { params: { clientId: string } }) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];
   const data = await req.json();

   try {
      const { payload } = await jwtVerify(jwtToken as string, secret);

      const guests = await Promise.all(
         data.data.map(async (clientId: any) => {
            const guest = await prisma.guest.findMany({
               select: {
                  id: true,
                  guestId: true,
                  name: true,
                  scenario: true,
                  GuestDetail: true,
                  Invitations: {
                     select: {
                        Question: {
                           select: {
                              id: true,
                              question: true,
                           },
                        },
                        answer: true,
                     },

                     orderBy: {
                        questionId: 'asc',
                     },
                  },
               },
               where: {
                  id: clientId,
               },
            });

            const formattedGuest = guest.map((guest) => {
               const detail = guest.GuestDetail.reduce(
                  (acc: any, detail: any) => {
                     acc[detail.detail_key] = detail.detail_val;
                     return acc;
                  },
                  { guestId: guest.guestId }
               );

               const question = guest.Invitations.map((invitation) => {
                  return {
                     question: invitation.Question.question,
                     answer: invitation.answer,
                  };
               });

               return {
                  id: guest.id,
                  guestId: guest.guestId,
                  name: guest.name,
                  scenario: guest.scenario,
                  ...detail,
                  questions: question,
               };
            });

            return formattedGuest[0];
         })
      );

      logger.info(`Dashboard export data successfully for client: ${params.clientId}`, {
         data: guests,
      });

      return NextResponse.json(
         {
            status: 200,
            message: 'Dashboard data fetched successfully',
            data: guests,
         },
         { status: 200 }
      );
   } catch (error) {
      const errorMessage = error as Error;
      const jwtError = error as JWTError;

      if (jwtError.code === 'ERR_JWT_EXPIRED' || jwtError.code === 'ERR_JWS_INVALID') {
         logger.error(`Failed export dashboard data for client: ${params.clientId}`, {
            error: 'Unauthorized',
            timestamp: new Date().toISOString(),
         });
         return NextResponse.json(
            {
               satatus: 401,
               message: 'unauthorized',
            },
            { status: 401 }
         );
      }

      logger.error(`Failed export dashboard data for client: ${params.clientId}`, {
         error: errorMessage.message,
         timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
         {
            status: 500,
            message: errorMessage.message,
         },
         { status: 500 }
      );
   }
}
