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

      return NextResponse.json(
         { status: 200, message: 'Qr files has been fetched successfully', data: qrFiles },
         { status: 200 }
      );
   } catch (error) {
      return NextResponse.json({ status: 500, error: 'Internal server error' }, { status: 500 });
   }
}
