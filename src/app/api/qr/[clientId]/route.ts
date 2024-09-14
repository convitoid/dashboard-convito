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

      if (!client) {
         return NextResponse.json({ status: 404, error: 'Client not found' }, { status: 404 });
      }

      const qrFiles = await prisma.qrFile.findMany({
         where: {
            clientId: client.id,
         },
      });

      if (!qrFiles) {
         return NextResponse.json({ status: 404, error: 'QR files not found' }, { status: 404 });
      }

      logger.info('QR files has been fetched successfully', { clientId: params.clientId, data: qrFiles });

      return NextResponse.json(
         { status: 200, message: 'Qr files has been fetched successfully', data: qrFiles },
         { status: 200 }
      );
   } catch (error: any) {
      logger.error('Failed to fetch qr files', { clientId: params.clientId, error: error.message });
      return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
   }
}
