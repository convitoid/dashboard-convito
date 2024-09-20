import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest, { params }: { params: { clientId: string } }) {
   const { search_by, is_answer, value } = await req.json();

   try {
      const client = await prisma.client.findFirst({
         select: {
            id: true,
         },
         where: {
            client_id: params.clientId,
         },
      });

      switch (search_by) {
         case 'answered_question':
            const guests = await prisma.guest.findMany({
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
                     },
                  },
                  SendBlastingLogs: {
                     orderBy: {
                        createdAt: 'desc',
                     },
                  },
               },
               where: {
                  clientId: client?.id,
                  Invitations: {
                     some: {
                        answer: value === 'yes' ? { not: null } : { equals: null },
                     },
                  },
               },
               orderBy: {
                  name: 'asc',
               },
            });

            if (guests.length === 0) {
               return NextResponse.json({
                  status: 404,
                  message: 'No data found',
               });
            }

            return NextResponse.json({
               status: 200,
               message: 'filter by answered question',
               data: guests,
            });
            // code block
            break;

         default:
            // code block
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
                     },
                  },
                  SendBlastingLogs: true,
               },
               where: {
                  clientId: client?.id,
                  OR: [
                     {
                        name: {
                           contains: value,
                           mode: 'insensitive',
                        },
                     },
                     {
                        scenario: {
                           contains: value,
                           mode: 'insensitive',
                        },
                     },
                  ],
                  AND: is_answer
                     ? [
                          {
                             Invitations: {
                                some: {
                                   answer:
                                      is_answer === 'yes'
                                         ? { not: null } // Cari answer yang bukan null
                                         : { equals: null }, // Cari answer yang null
                                },
                             },
                          },
                       ]
                     : undefined,
               },
               orderBy: {
                  name: 'asc',
               },
            });

            console.log('is_answer', is_answer === 'yes' ? 'data yes' : is_answer === 'no' ? 'data no' : 'all data');

            console.log(guest);

            if (guest.length === 0) {
               return NextResponse.json({
                  status: 404,
                  message: 'No data found',
               });
            }

            return NextResponse.json({
               status: 200,
               message: 'filter by default',
               data: guest,
            });
            break;
      }
   } catch (error) {
      return NextResponse.json({
         status: 500,
         message: 'Internal server error',
      });
   }
}
