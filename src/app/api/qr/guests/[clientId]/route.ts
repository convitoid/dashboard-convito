import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { clientId: string } }) {
   console.log(params.clientId);
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
            qr_code: 'asc',
         },
      });

      return NextResponse.json(
         {
            status: 200,
            message: 'This is a GET requests',
            data: guests,
         },
         { status: 200 }
      );
   } catch (error) {
      return NextResponse.json(
         {
            status: 500,
            error: error as Error,
         },
         { status: 500 }
      );
   }
}
