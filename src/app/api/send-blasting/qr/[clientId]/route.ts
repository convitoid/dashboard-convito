import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { sendBlastingQrServiceV2, BlastType } from '@/services/sendBlastingQrService';
import { NextRequest, NextResponse } from 'next/server';

// Define the interface for the blasting message structure
interface BlastingMessage {
   status: number;
   message: string;
}

// Define the type for the response
type BlastingMessageResponse = BlastingMessage;

export async function POST(req: NextRequest, { params }: { params: { clientId: string } }) {
   const body = await req.json();
   
   // Extract blastType from request body, default to 'both' for backward compatibility
   const { guests, blastType = 'both' }: { guests: any[]; blastType?: BlastType } = body;
   
   // Support both old format (array) and new format (object with guests and blastType)
   const guestData = Array.isArray(body) ? body : guests;

   try {
      // get client
      const client = await prisma.client.findFirst({
         where: {
            client_id: params.clientId,
         },
      });

      if (!client) {
         return NextResponse.json({ status: 404, message: 'Client not found' }, { status: 404 });
      }

      // get template
      const template = await prisma.qrBroadcastTemplate.findMany({
         where: {
            clientId: client?.id,
         },
      });

      if (!template || template.length === 0) {
         return NextResponse.json({ status: 404, message: 'Template not found' }, { status: 404 });
      }

      // check if image exist
      const image = await prisma.qrGalleryImage.findMany({
         where: {
            clientId: client?.id,
         },
      });

      const qrFile = await prisma.qrFile.findMany({
         where: {
            clientId: client?.id,
         },
      });

      const blastingMessage = (await sendBlastingQrServiceV2(
         guestData, 
         template, 
         image, 
         qrFile,
         blastType
      )) as BlastingMessageResponse;

      logger.info('Blasting message sent successfully', { blastingMessage, blastType });

      return NextResponse.json(
         {
            status: blastingMessage.status,
            message: blastingMessage.message,
         },
         { status: 200 }
      );
   } catch (error) {
      logger.error('Error while sending broadcast', { error });

      return NextResponse.json(
         {
            status: 500,
            message: 'Internal server error',
         },
         { status: 500 }
      );
   }
}
