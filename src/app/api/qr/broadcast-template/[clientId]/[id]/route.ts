import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { clientId: string; id: string } }) {
   try {
      const client = await prisma.client.findFirst({
         select: {
            QrBroadcastTemplate: {
               where: {
                  id: Number(params.id),
               },
            },
         },
         where: {
            client_id: params.clientId,
         },
      });

      return NextResponse.json({
         status: 201,
         message: 'QR Broadcast template fetched successfully',
         data: client,
      });
   } catch (error) {
      return NextResponse.json(
         {
            message: error as Error,
         },
         { status: 500 }
      );
   }
}
