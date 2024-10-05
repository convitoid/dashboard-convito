import prisma from '@/libs/prisma';
import { revalidatePath } from 'next/cache';
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
                        Question: {
                           select: {
                              position: true,
                           },
                        },
                     },
                     orderBy: {
                        Question: {
                           position: 'asc',
                        }
                     }
                  },
                  GuestDetail: {
                     select: {
                        detail_key: true,
                        detail_val: true,
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

            if (guests.length === 0) {
               return NextResponse.json({
                  status: 404,
                  message: 'No data found',
               });
            }

            const newJson = await Promise.all(
               guests.map(async (g: any) => {
                  const detail = g.GuestDetail.reduce(
                     (acc: any, detail: any) => {
                        acc[detail.detail_key] = detail.detail_val;
                        return acc;
                     },
                     { guestId: g.guestId }
                  );

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

            const filteredGuests = () => {
               if (value === 'yes') {
                  return newJson.filter((item: any) => item.Invitations.length > 0 && item.Invitations[0].answer !== null)
               } else {
                  return newJson.filter((item: any) => item.Invitations.length > 0 && item.Invitations[0].answer === null)
               }
            }

            return NextResponse.json({
               status: 200,
               message: 'filter by answered question',
               data: filteredGuests(),
            });

         default:
            // code block
            console.log('default');
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
                  GuestDetail: {
                     select: {
                        detail_key: true,
                        detail_val: true,
                     },
                  },
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

            const newJsonGlobalFilter = await Promise.all(
               guest.map(async (g: any) => {
                  const detail = g.GuestDetail.reduce(
                     (acc: any, detail: any) => {
                        acc[detail.detail_key] = detail.detail_val;
                        return acc;
                     },
                     { guestId: g.guestId }
                  );

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

            if (guest.length === 0) {
               return NextResponse.json({
                  status: 404,
                  message: 'No data found',
               });
            }

            revalidatePath(req.nextUrl.pathname);

            return NextResponse.json({
               status: 200,
               message: 'filter by default',
               data: newJsonGlobalFilter,
            });
      }
   } catch (error) {
      return NextResponse.json({
         status: 500,
         message: 'Internal server error',
      });
   }
}
