import { QrBroadcastTemplateTab } from '@/components/tab/QrBroadcastTemplateTab';
import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { sendBlastingQrService } from '@/services/sendBlastingService';
import { NextRequest, NextResponse } from 'next/server';

// Define the interface for the message structure
interface MessageDetail {
   message: string;
   type: string;
   code: number;
   fbtrace_id: string;
}

// Define the interface for the blasting message structure
interface BlastingMessage {
   status: number;
   message: string;
}

// Define the type for the response, which is an array of BlastingMessage objects
type BlastingMessageResponse = BlastingMessage;

export async function POST(req: NextRequest, { params }: { params: { clientId: string } }) {
   const body = await req.json();

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

      if (!template) {
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

      const blastingMessage = (await sendBlastingQrService(body, template, image, qrFile)) as BlastingMessageResponse;


      logger.info('Blasting message sent successfully', { blastingMessage });

      return NextResponse.json(
         {
            status: blastingMessage.status,
            message: blastingMessage.message,
         },
         { status: 200 }
      );
   } catch (error) {
      const createErrorLogs = await prisma.qrBroadcastLogs.create({
         data: {
            QrGuestId: body.id,
            status: 'failed_sent',
         },
      });

      logger.error('Error while sending broadcast', { error });

      return NextResponse.json(
         {
            status: 500,
            message: error,
         },
         { status: 500 }
      );
   }
}
