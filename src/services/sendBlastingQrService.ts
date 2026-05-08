import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import plimit from 'p-limit';
import { encodeImageUrl } from '../utils/encodeImageUrl';
import { uploadMediaToWhatsApp } from '../utils/uploadMediaToWhatsApp';

// Reduced from 3 to 1 to prevent WhatsApp rate limiting (error 131053)
const limit = plimit(1);

export type BlastType = 'reminder' | 'qr_code' | 'both';

interface BlastingResponse {
   status: number;
   message: string;
}

export const sendBlastingQrServiceV2 = async (
   body: any,
   template: any,
   image: any,
   qrFile: any,
   blastType: BlastType = 'both'
): Promise<BlastingResponse> => {
   return new Promise((resolve) => {
      const messageMap = {
         reminder: 'Reminder blasting process started',
         qr_code: 'QR Code blasting process started',
         both: 'Blasting process started',
      };
      
      logger.info('=== BLAST START ===', { 
         blastType, 
         guestCount: body?.length,
         hasImage: image?.length > 0,
         qrFileCount: qrFile?.length,
         templateCount: template?.length
      });
      
      resolve({ status: 200, message: messageMap[blastType] });

      const processBlasting = async () => {
         try {
            if (blastType === 'reminder' || blastType === 'both') {
               logger.info('Starting REMINDER messages...');
               await sendReminderMessages(body, template, image);
               logger.info('REMINDER messages completed');
            }

            if (blastType === 'qr_code' || blastType === 'both') {
               logger.info('Starting QR CODE messages...');
               await sendQrCodeMessages(body, template, qrFile);
               logger.info('QR CODE messages completed');
            }
            
            logger.info('=== BLAST COMPLETE ===', { blastType });
         } catch (error) {
            logger.error('Error in processBlasting', { error });
         }
      };

      // Trigger background process
      setTimeout(processBlasting, 0);
   });
};

// Send reminder messages
const sendReminderMessages = async (body: any, template: any, image: any) => {
   const hasImage = image?.length > 0;
   const reminderTemplateName = template.find((t: any) => t.type === 'reminder_template')?.name;
   
   logger.info('Reminder config', { hasImage, templateName: reminderTemplateName });

   // Upload image to WhatsApp first if exists
   let mediaId: string | null = null;
   if (hasImage) {
      try {
         const imageUrl = encodeImageUrl(process.env.NEXTAUTH_URL || '', image[0].path);
         logger.info('Attempting to upload reminder image', { imageUrl });
         mediaId = await uploadMediaToWhatsApp(imageUrl);
         logger.info('✅ Reminder image uploaded successfully - Using MEDIA_ID', { mediaId });
      } catch (error: any) {
         logger.error('⚠️ Failed to upload reminder image - Will fallback to URL', { 
            error: error.message,
            stack: error.stack,
            imagePath: image[0].path 
         });
         // Don't throw error, let it fallback to URL
         mediaId = null;
      }
   }

   await Promise.all(
      body.map((guest: any) =>
         limit(async () => {
            try {
               const whatsappBody = buildReminderBody(guest, reminderTemplateName, hasImage, image, mediaId);
               
               logger.info('📤 Sending reminder', { 
                  guestId: guest.id, 
                  name: guest.name, 
                  phone: guest.phoneNumber,
                  hasImage,
                  mediaId,
                  body: JSON.stringify(whatsappBody, null, 2)
               });

               const response = await sendWhatsAppMessage(whatsappBody);
               const whatsappResponse = await response.json();
               
               logger.info('📥 WhatsApp response', { 
                  guestId: guest.id, 
                  ok: response.ok, 
                  status: response.status,
                  response: JSON.stringify(whatsappResponse, null, 2)
               });

               // Log detailed error if exists
               if (whatsappResponse.error) {
                  logger.error('❌ WhatsApp API Error Details', {
                     guestId: guest.id,
                     errorCode: whatsappResponse.error.code,
                     errorMessage: whatsappResponse.error.message,
                     errorType: whatsappResponse.error.type,
                     errorData: whatsappResponse.error.error_data,
                     errorDetails: whatsappResponse.error.error_data?.details,
                     fbtrace_id: whatsappResponse.error.fbtrace_id
                  });
               }

               await saveWebhook(guest.id, reminderTemplateName, 'QR_REMINDER', whatsappResponse);

               if (response.ok) {
                  await updateBroadcastLog(guest.id, 'reminder_sent');
                  logger.info('Reminder sent SUCCESS', { guestId: guest.id, name: guest.name });
               } else {
                  await updateBroadcastLog(guest.id, 'reminder_failed');
                  logger.error('Reminder FAILED', { guestId: guest.id, error: whatsappResponse });
               }
            } catch (error) {
               await updateBroadcastLog(guest.id, 'reminder_failed');
               logger.error('Reminder ERROR', { guestId: guest.id, error });
            }
         })
      )
   );
};

// Send QR code messages
const sendQrCodeMessages = async (body: any, template: any, qrFile: any) => {
   const qrTemplateName = template.find((t: any) => t.type === 'qr_template')?.name;
   
   logger.info('QR Code config', { templateName: qrTemplateName, qrFileCount: qrFile?.length });

   await Promise.all(
      body.map((guest: any) =>
         limit(async () => {
            try {
               const qrFileUrl = qrFile.find((qr: any) => qr.code === guest.qr_code);
               if (!qrFileUrl) {
                  logger.error('❌ QR file not found', { guestId: guest.id, qrCode: guest.qr_code });
                  await updateBroadcastLog(guest.id, 'qr_failed');
                  return;
               }

               // Upload QR image to WhatsApp first
               let mediaId: string | null = null;
               try {
                  const qrImageUrl = encodeImageUrl(process.env.NEXTAUTH_URL || '', qrFileUrl.path);
                  logger.info('Attempting to upload QR image', { qrImageUrl, guestId: guest.id });
                  mediaId = await uploadMediaToWhatsApp(qrImageUrl);
                  logger.info('✅ QR image uploaded successfully - Using MEDIA_ID', { mediaId, guestId: guest.id });
               } catch (uploadError: any) {
                  logger.error('⚠️ Failed to upload QR image - Will fallback to URL', { 
                     guestId: guest.id,
                     error: uploadError.message,
                     stack: uploadError.stack,
                     qrPath: qrFileUrl.path 
                  });
                  // Don't return, let it fallback to URL
                  mediaId = null;
               }

               const whatsappBody = buildQrCodeBody(guest, qrTemplateName, qrFileUrl.path, mediaId);
               
               logger.info('📤 Sending QR', { 
                  guestId: guest.id, 
                  name: guest.name, 
                  phone: guest.phoneNumber,
                  qrPath: qrFileUrl.path,
                  mediaId,
                  body: JSON.stringify(whatsappBody, null, 2)
               });

               const response = await sendWhatsAppMessage(whatsappBody);
               const whatsappResponse = await response.json();
               
               logger.info('📥 WhatsApp QR response', { 
                  guestId: guest.id, 
                  ok: response.ok, 
                  status: response.status,
                  response: JSON.stringify(whatsappResponse, null, 2)
               });

               // Log detailed error if exists
               if (whatsappResponse.error) {
                  logger.error('❌ WhatsApp API Error Details', {
                     guestId: guest.id,
                     errorCode: whatsappResponse.error.code,
                     errorMessage: whatsappResponse.error.message,
                     errorType: whatsappResponse.error.type,
                     errorData: whatsappResponse.error.error_data,
                     errorDetails: whatsappResponse.error.error_data?.details,
                     fbtrace_id: whatsappResponse.error.fbtrace_id
                  });
               }

               await saveWebhook(guest.id, qrTemplateName, 'QR_CODE', whatsappResponse);

               if (response.ok) {
                  await updateBroadcastLog(guest.id, 'qr_sent');
                  logger.info('QR sent SUCCESS', { guestId: guest.id, name: guest.name });
               } else {
                  await updateBroadcastLog(guest.id, 'qr_failed');
                  logger.error('QR FAILED', { guestId: guest.id, error: whatsappResponse });
               }
            } catch (error) {
               await updateBroadcastLog(guest.id, 'qr_failed');
               logger.error('QR ERROR', { guestId: guest.id, error });
            }
         })
      )
   );
};

// Build reminder message body
const buildReminderBody = (guest: any, templateName: string, hasImage: boolean, image: any, mediaId: string | null) => {
   const baseBody = {
      messaging_product: 'whatsapp',
      to: `+${guest.phoneNumber}`,
      type: 'template',
      template: {
         name: templateName,
         language: { code: 'en' },
         components: [] as any[],
      },
   };

   if (hasImage) {
      baseBody.template.components.push({
         type: 'header',
         parameters: [
            {
               type: 'image',
               image: mediaId
                  ? { id: mediaId }  // Use media_id if upload successful
                  : { link: encodeImageUrl(process.env.NEXTAUTH_URL || '', image[0].path) },  // Fallback to URL
            },
         ],
      });
   }

   baseBody.template.components.push({
      type: 'body',
      parameters: [{ type: 'text', text: guest.name }],
   });

   return baseBody;
};

// Build QR code message body
const buildQrCodeBody = (guest: any, templateName: string, qrPath: string, mediaId: string | null) => {
   const imageUrl = encodeImageUrl(process.env.NEXTAUTH_URL || '', qrPath);
   
   logger.info('Building QR body', {
      qrPath,
      baseUrl: process.env.NEXTAUTH_URL,
      finalUrl: imageUrl,
      usingMediaId: !!mediaId,
   });

   return {
      messaging_product: 'whatsapp',
      to: `+${guest.phoneNumber}`,
      type: 'template',
      template: {
         name: templateName,
         language: { code: 'en' },
         components: [
            {
               type: 'header',
               parameters: [
                  {
                     type: 'image',
                     image: mediaId
                        ? { id: mediaId }  // Use media_id if upload successful
                        : { link: encodeImageUrl(process.env.NEXTAUTH_URL || '', qrPath) },  // Fallback to URL
                  },
               ],
            },
         ],
      },
   };
};

// Send message to WhatsApp API
const sendWhatsAppMessage = async (body: any) => {
   const headers = new Headers();
   headers.append('Content-Type', 'application/json');
   headers.append('Authorization', `Bearer ${process.env.NEXT_WHATSAPP_TOKEN_ID}`);

   return fetch(`https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
   });
};

// Save webhook data
const saveWebhook = async (guestId: number, templateName: string, source: string, response: any) => {
   const qrGuest = await prisma.qrGuest.findFirst({
      select: { clientId: true, phoneNumber: true },
      where: { id: guestId },
   });

   if (!qrGuest) return;

   const contactWaId = response.contacts?.[0]?.wa_id;
   const isBSUID = contactWaId && contactWaId.includes('.');

   const webhookData = {
      templateName,
      blastingSource: source,
      waId: response.messages?.[0]?.id,
      status: response.messages?.[0]?.message_status,
      recipientId: isBSUID ? null : contactWaId,
      bsuid: isBSUID ? contactWaId : null,
      clientId: qrGuest.clientId,
      lastUpdateStatus: new Date(),
   };

   logger.info('Webhook data to save', {
      guestId,
      guestPhoneNumber: qrGuest.phoneNumber,
      recipientIdFromWhatsApp: contactWaId,
      identityFormat: isBSUID ? 'BSUID' : 'PHONE_NUMBER',
      webhookData,
   });

   // Delete existing webhook
   await prisma.webhook.deleteMany({
      where: {
         OR: [
            { recipientId: webhookData.recipientId, blastingSource: source, clientId: webhookData.clientId },
            { bsuid: webhookData.bsuid, blastingSource: source, clientId: webhookData.clientId },
         ],
      },
   });

   await prisma.webhook.create({ data: webhookData });
};

// Update broadcast log
const updateBroadcastLog = async (guestId: number, status: string) => {
   const existing = await prisma.qrBroadcastLogs.findFirst({
      where: { QrGuestId: guestId },
   });

   if (existing) {
      await prisma.qrBroadcastLogs.update({
         where: { id: existing.id },
         data: { status },
      });
   } else {
      await prisma.qrBroadcastLogs.create({
         data: { QrGuestId: guestId, status },
      });
   }
};
