import prisma from '@/libs/prisma';
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
      });

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
            guests: guests,
         },
      ];

      return NextResponse.json(
         {
            status: 200,
            message: 'Dashboard data fetched successfully',
            data: data,
         },
         { status: 200 }
      );
   } catch (error) {
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
