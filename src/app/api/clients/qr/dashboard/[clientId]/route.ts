import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
   try {
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
               body: {
                  error: 'Client not found',
               },
            },
            { status: 404 }
         );
      }

      const guests = await prisma.qrGuest.findMany({
         select: {
            id: true,
            name: true,
            phoneNumber: true,
            qr_code: true,
            QrBroadcastLogs: true,
         },
         where: {
            clientId: client.id,
         },
         orderBy: {
            name: 'asc',
         },
      });

      const newJson = await Promise.all(
         guests.map(async (g: any) => {
            const webhook = await prisma.webhook.findMany({
               select: {
                  id: true,
                  status: true,
                  statusCode: true,
                  blastingSource: true,
                  lastUpdateStatus: true,
               },
               where: {
                  blastingSource: {
                     not: 'RSVP',
                  },
                  recipientId: g.phoneNumber,
                  clientId: client?.id,
               },
            });

            const dashboardTableData = {
               ...g,
               webhook: webhook,
            };

            return dashboardTableData;
         })
      );

      const totalGuests = guests.length;
      const totalBroadcastSend = guests.filter((guest) => guest.QrBroadcastLogs.length > 0).length;
      const totalNotSendYet = guests.filter((guest) => guest.QrBroadcastLogs.length === 0).length;
      const broadcastSuccess = guests
         .map((guest) => guest.QrBroadcastLogs.filter((status) => status.status === 'success_sent').length)
         .reduce((a, b) => a + b, 0);
      const broadcastFailed = guests
         .map((guest) => guest.QrBroadcastLogs.filter((status) => status.status === 'failed_sent').length)
         .reduce((a, b) => a + b, 0);

      const data = [
         {
            totalGuests: totalGuests,
            totalBroadcastSend: totalBroadcastSend,
            totalNotSendYet: totalNotSendYet,
            broadcastSuccess: broadcastSuccess,
            broadcastFailed: broadcastFailed,
            guests: newJson,
         },
      ];

      logger.info(`Dashboard data fetched successfully for client: ${params.clientId}`, {
         data: data,
      });

      revalidatePath(req.nextUrl.pathname);

      return NextResponse.json(
         {
            status: 200,
            message: 'Dashboard data fetched successfully',
            data: data,
         },
         { status: 200 }
      );
   } catch (error: any) {
      logger.error(`Failed to fetch dashboard data for client: ${params.clientId}`, {
         error: error.message,
         timestamp: new Date().toISOString(),
      });
      return NextResponse.json(
         {
            status: 500,
            body: {
               error: 'Internal Server Error',
            },
         },
         { status: 500 }
      );
   }
}
