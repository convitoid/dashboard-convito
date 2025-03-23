import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { jwtVerify } from 'jose';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { cleanPhoneNumber, cleanString, detectHiddenChars } from '@/utils/clearPhoneNumber';

interface JWTError extends Error {
   code?: string;
}

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '');

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
   const token = req.headers.get('authorization');
   const jwtToken = token?.split(' ')[1];
   const path = req.nextUrl.pathname;

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
                  token: true,
                  Question: {
                     select: {
                        position: true,
                     },
                  },
               },
            },
            GuestDetail: {
               select: {
                  detail_key: true,
                  detail_val: true,
               },
               //    where: {
               //       id: 21679,
               //    },
            },
            // get only new log
         },
         where: {
            clientId: client?.id,
            // clientId: client,
            // id: 5831,
         },
         orderBy: {
            name: 'asc',
         },
      });

      const newJson = await Promise.all(
         guest.map(async (g: any) => {
            const detail = g.GuestDetail.reduce(
               (acc: any, detail: any) => {
                  acc[detail.detail_key] = detail.detail_val;
                  return acc;
               },
               { guestId: g.guestId }
            );

            if (detail.phone_number) {
               detail.phone_number = cleanPhoneNumber(detail.phone_number);
            }

            if (detail.phone_number) {
               // Deteksi karakter tersembunyi untuk debugging
               const hiddenChars = detectHiddenChars(detail.phone_number);
               if (hiddenChars.length > 0) {
                  console.log('Nomor telepon asli:', detail.phone_number);
                  console.log('Karakter tersembunyi:', hiddenChars);
               }

               // Bersihkan nomor telepon
               detail.phone_number = cleanString(detail.phone_number);

               // Verifikasi bahwa hasilnya benar
               if (!/^\+?\d+$/.test(detail.phone_number)) {
                  console.warn(`Nomor telepon masih mengandung karakter non-digit: ${detail.phone_number}`);
               }
            }

            const webhookData = await prisma.webhook.findMany({
               select: {
                  id: true,
                  status: true,
                  statusCode: true,
                  blastingSource: true,
                  lastUpdateStatus: true,
               },
               where: {
                  blastingSource: 'RSVP',
                  recipientId: detail.phone_number,
                  clientId: client?.id,
               },
            });

            const dashboardTableData = {
               ...g,
               webhook: webhookData,
            };

            return dashboardTableData;
         })
      );

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
            guest: newJson,
         },
      ];

      logger.info(`Dashboard data fetched successfully for client: ${params.clientId}`, {
         data: statisticData,
      });

      revalidatePath(path);

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
   const { filter_by } = await req.json();

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
                  answerAt: true,
               },

               orderBy: {
                  questionId: 'asc',
               },
            },
         },
         where: {
            clientId: client?.id,
         },

         orderBy: {
            name: 'asc',
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
               answer_at: invitation.answerAt,
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

      const filteredData = () => {
         if (filter_by === 'yes') {
            return formattedGuest.filter((item: any) => item.questions.length > 0 && item.questions[0].answer !== null);
         } else if (filter_by === 'no') {
            return formattedGuest.filter((item: any) => item.questions.length > 0 && item.questions[0].answer === null);
         } else {
            return formattedGuest;
         }
      };

      logger.info(`Dashboard export data successfully for client: ${params.clientId}`, {
         data: filteredData(),
      });

      revalidatePath(req.nextUrl.pathname);

      return NextResponse.json(
         {
            status: 200,
            message: 'Dashboard data fetched successfully',
            data: filteredData(),
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
