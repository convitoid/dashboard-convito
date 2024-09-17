import logger from '@/libs/logger';
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

      const guests = await prisma.qrGuest.findMany({
         where: {
            clientId: client?.id,
         },
         orderBy: {
            name: 'asc',
         },
      });

      logger.info(`QR Guests fetched successfully for client: ${params.clientId}`, {
         data: guests,
      });

      return NextResponse.json(
         {
            status: 200,
            message: 'This is a GET requests',
            data: guests,
         },
         { status: 200 }
      );
   } catch (error: any) {
      logger.info(`Error fetching QR Guests for client: ${params.clientId}`, {
         error: error,
      });
      return NextResponse.json(
         {
            status: 500,
            error: error as Error,
         },
         { status: 500 }
      );
   }
}
