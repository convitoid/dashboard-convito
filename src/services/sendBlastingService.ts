import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { getErrorResponse, getSuccessReponse } from '@/utils/response/successResponse';
import jwt from 'jsonwebtoken';
import plimit from 'p-limit';
import { WhatsappBlastBody } from '../utils/whatsappBlastBody';
import { encodeImageUrl } from '../utils/encodeImageUrl';
import { uploadMediaToWhatsApp } from '../utils/uploadMediaToWhatsApp';

// Reduced from 3 to 1 to prevent WhatsApp rate limiting (error 131053)
const limit = plimit(1)


type InvitationsWhereUniqueInput = {
   id?: number;
   guestId?: number;
   // other properties
};

export const sendBlastingService = async (data: any, clientId: any, clientCode: any) => {
   try {
      const clientImage = await prisma.clientImage.findFirst({
         where: {
            clientId: clientId,
            flag: 'blasting_whatsapp',
         },
      });

      const clientVideo = await prisma.clientVideo.findFirst({
         where: {
            clientId: clientId,
            flag: 'blasting_whatsapp',
         },
      });

      const generateLink = async (data: any) => {
         const dataFiltered = {
            id: data.data.id,
            name: data.data.name,
            clientCode: data.clientCode,
         };

         const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? '').toString();

         const createJWT = (data: any) => {
            return jwt.sign(data, secret, {
               expiresIn: '30d',
            });
         };

         const token = createJWT(dataFiltered);
         return token;
      };

      const guests = await prisma.guest.findMany({
         where: {
            clientId: clientId,
            id: {
               in: data.map((d: any) => d.id),
            },
         },
      });

      const invitationData = await Promise.all(
         guests.map(async (guest: any) => {
            const scenario = await prisma.scenario.findMany({
               where: {
                  scenario_slug: guest.scenario_slug,
                  client_id: guest.clientId,
               },
               include: {
                  ScenarioQuestion: true,
               },
            });

            const scenarioQuestion = scenario.map((s) => {
               return s.ScenarioQuestion;
            });

            return {
               guest_id: guest.id,
               guest_code: guest.guestId,
               guest_name: guest.name,
               client_id: guest.clientId,
               scenario_question: scenarioQuestion,
            };
         })
      );

      const createInvitation = await Promise.all(
         invitationData.map(async (guest) => {
            const question = guest.scenario_question.map((q) => {
               return q.map((question) => {
                  return {
                     question_id: question.question_id,
                  };
               });
            });

            return {
               guest_id: guest.guest_id,
               guest_code: guest.guest_code,
               guest_name: guest.guest_name,
               question: question[0],
            };
         })
      );

      const newJson: any[] = [];

      const createInvitationsData = async (createInvitation: any[], clientId: number) => {
         const invitationsData = await Promise.all(
            createInvitation.flatMap(async (guest: any) =>
               Promise.all(
                  guest.question.map(async (q: any) => ({
                     clientId: clientId,
                     guestId: guest.guest_id,
                     questionId: q.question_id,
                     token: await generateLink({
                        data: { id: guest.guest_id, name: guest.guest_name },
                        clientCode: guest.guest_code,
                     }),
                  }))
               )
            )
         );

         return invitationsData.flat();
      };

      const invitationsData = await createInvitationsData(createInvitation, clientId);
      // console.log('invitationsData', invitationsData);

      const invitationExist = await prisma.invitations.findMany({
         where: {
            guestId: {
               in: invitationsData.map((i) => i.guestId),
            },
         },
      });

      if (invitationExist.length > 0) {
         await prisma.invitations.deleteMany({
            where: {
               guestId: {
                  in: invitationExist.map((i) => i.guestId),
               },
            },
         });
      }

      const invitationCreateData = await prisma.invitations.createMany({
         data: invitationsData,
      });

      // Upload image to WhatsApp first if exists (for RSVP with header_image)
      let mediaId: string | null = null;
      if (clientImage && clientImage.imagePath) {
         try {
            const imageUrl = encodeImageUrl(process.env.NEXTAUTH_URL || '', clientImage.imagePath);
            logger.info('Attempting to upload RSVP image', { imageUrl });
            mediaId = await uploadMediaToWhatsApp(imageUrl);
            logger.info('✅ RSVP image uploaded successfully - Using MEDIA_ID', { mediaId, imageUrl });
         } catch (error: any) {
            logger.error('⚠️ Failed to upload RSVP image - Will fallback to URL', { 
               error: error.message, 
               stack: error.stack,
               imageUrl: clientImage.imagePath 
            });
            // Don't throw error, let it fallback to URL
            mediaId = null;
         }
      }

      const sendBlastingProcess = await Promise.all(
         data.map((d: any) => limit(async () => {
logger.info('DEBUG - Guest data:', JSON.stringify(d, null, 2));
            logger.info('DEBUG - broadcastTemplate structure:', JSON.stringify(d.broadcastTemplate, null, 2));
            const templateBody = await WhatsappBlastBody({
               data: d,
               broadcastTemplate: d.broadcastTemplate,
               image: clientImage,
               video: clientVideo,
               clientCode: clientCode,
               mediaId: mediaId,  // Pass mediaId to WhatsappBlastBody
            });

            logger.info('Message body to WhatsApp', { 
               guestId: d.id, 
               guestName: d.name,
               usingMediaId: !!mediaId,
            });
            console.log('=== TEMPLATE BODY ===');
            console.log(JSON.stringify(templateBody, null, 2));
            console.log('=====================');

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${process.env.NEXT_WHATSAPP_TOKEN_ID}`);

            const response = await fetch(
               `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
               {
                  method: 'POST',
                  headers: myHeaders,
                  body: JSON.stringify(templateBody),
                  redirect: 'follow',
               }
            );

            const res = await response.json();

            if (res.error) {
               return {
                  error: res.error,
                  guest: { id: d.id, name: d.name },
               };
            }
            return {
               template_name: templateBody?.template?.name,
               ...res,
               clientCode: clientCode,
               guest: { id: d.id, name: d.name },
            };
         }))
      );
      logger.info('Response from whatsapp', JSON.stringify(sendBlastingProcess))

      if (sendBlastingProcess.some((res) => res.error)) {
         const errorData = sendBlastingProcess.filter((res) => res.error);
         const message = errorData.map((e) => e.error.message);
         errorData.map(async (e) => {
            await prisma.sendBlastingLogs.create({
               data: {
                  guestId: e.guest.id,
                  status: 'failed_send_blasting',
                  logs: e.error.message,
               },
            });
         });

         await prisma.invitations.deleteMany({
            where: {
               guestId: {
                  in: errorData.map((e) => e.guest.id),
               },
            },
         });

         // return getSuccessReponse({ error: errorData }, 400, message[0]);
         return getErrorResponse(sendBlastingProcess[0].error.message, 400, message[0]);
      } else {
         data.map(async (d: any) => {
            await prisma.sendBlastingLogs.create({
               data: {
                  guestId: d.id,
                  status: 'success_send_blasting',
                  logs: 'Successfully sent',
               },
            });
         });

         const webhookData = await Promise.all(
            sendBlastingProcess.map(async (webhook: any) => {
               const client = await prisma.client.findFirst({
                  select: {
                     id: true,
                  },
                  where: {
                     client_id: webhook.clientCode,
                  },
               });

               return {
                  templateName: webhook.template_name,
                  blastingSource: 'RSVP',
                  waId: webhook.messages.map((data: any) => data.id)[0],
                  status: webhook.messages.map((data: any) => data.message_status)[0],
                  recipientId: webhook.contacts.map((data: any) => data.wa_id)[0],
                  clientId: Number(client?.id),
                  lastUpdateStatus: new Date(),
               };
            })
         );

         const webhookExist = await prisma.webhook.findMany({
            where: {
               recipientId: {
                  in: webhookData.map((w) => w.recipientId),
               },
               blastingSource: 'RSVP',
               clientId: {
                  in: webhookData.map((w) => w.clientId),
               },
            },
         });


         if (webhookExist.length > 0) {
            await prisma.webhook.deleteMany({
               where: {
                  id: {
                     in: webhookExist.map((w) => w.id),
                  },
                  clientId: {
                     in: webhookExist.map((w) => w.clientId),
                  },
               },
            });
         }

         await prisma.webhook.createMany({
            data: webhookData,
         });

         return getSuccessReponse(invitationCreateData, 200, 'Successfully sent');
      }
   } catch (error) {
      logger.info('ERROR SEND SRVP: ', error);
      return error;
   }
};

export type BlastType = 'reminder' | 'qr_code' | 'both';

export const sendBlastingQrService = async (
   body: any, 
   template: any, 
   image: any, 
   qrFile: any,
   blastType: BlastType = 'both'  // default 'both' for backward compatibility
) => {
   return new Promise((resolve, reject) => {
      // Immediately resolve with 200 status and message
      const messageMap = {
         'reminder': 'Reminder blasting process started',
         'qr_code': 'QR Code blasting process started', 
         'both': 'Blasting process started'
      };
      resolve({ status: 200, message: messageMap[blastType] });

      const processBlasting = async () => {
         // Send REMINDER only or BOTH
         if (blastType === 'reminder' || blastType === 'both') {
            await sendReminderMessages(body, template, image, qrFile);
         }
         
         // Send QR CODE only or BOTH (with delay if both)
         if (blastType === 'qr_code' || blastType === 'both') {
            if (blastType === 'both') {
               // Add delay between reminder and QR when sending both
               await new Promise((resolve) => setTimeout(resolve, 10000));
            }
            await sendQrCodeMessages(body, template, qrFile);
         }
      };

      processBlasting().catch((error) => {
         logger.error('Error in processBlasting', { error });
      });
   });
};

// Helper function to send reminder messages
const sendReminderMessages = async (body: any, template: any, image: any, qrFile: any) => {
   const hasImage = image?.length > 0;
   
   // Upload image to WhatsApp first if exists
   let mediaId: string | null = null;
   if (hasImage) {
      try {
         const imageUrl = encodeImageUrl(process.env.NEXTAUTH_URL || '', image[0].path);
         mediaId = await uploadMediaToWhatsApp(imageUrl);
         logger.info('Reminder image uploaded to WhatsApp', { mediaId });
      } catch (error) {
         logger.error('Failed to upload reminder image, will use URL fallback', { error });
      }
   }
   
   await Promise.all(
      body.map(async (guest: any) => limit(async () => {
         try {
            const reminderTemplateName = template.find((t: any) => t.type === 'reminder_template')?.name;
            
            const whatsappBodyJsonReminder = hasImage ? {
               messaging_product: 'whatsapp',
               to: `+${guest.phoneNumber}`,
               type: 'template',
               template: {
                  name: reminderTemplateName,
                  language: { code: 'en' },
                  components: [
                     {
                        type: 'header',
                        parameters: [
                           {
                              type: 'image',
                              image: { id: mediaId },  // FORCED: Use media_id only
                           },
                        ],
                     },
                     {
                        type: 'body',
                        parameters: [{ type: 'text', text: guest.name }],
                     },
                  ],
               },
            } : {
               messaging_product: 'whatsapp',
               to: `+${guest.phoneNumber}`,
               type: 'template',
               template: {
                  name: reminderTemplateName,
                  language: { code: 'en' },
                  components: [
                     {
                        type: 'body',
                        parameters: [{ type: 'text', text: guest.name }],
                     },
                  ],
               },
            };

            logger.info('📤 Sending reminder message', {
               guestId: guest.id,
               hasImage,
               mediaId,
               body: JSON.stringify(whatsappBodyJsonReminder, null, 2)
            });

            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', `Bearer ${process.env.NEXT_WHATSAPP_TOKEN_ID}`);

            const response = await fetch(
               `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
               {
                  method: 'POST',
                  headers: myHeaders,
                  body: JSON.stringify(whatsappBodyJsonReminder),
               }
            );

            const whatsappResponse = await response.json();
            
            logger.info('📥 WhatsApp API response', {
               guestId: guest.id,
               status: response.status,
               ok: response.ok,
               response: JSON.stringify(whatsappResponse, null, 2)
            });

            // Log detailed error if exists
            if (whatsappResponse.error) {
               logger.error('❌ WhatsApp API returned error', {
                  guestId: guest.id,
                  errorCode: whatsappResponse.error.code,
                  errorMessage: whatsappResponse.error.message,
                  errorType: whatsappResponse.error.type,
                  errorData: whatsappResponse.error.error_data,
                  fbtrace_id: whatsappResponse.error.fbtrace_id
               });
            }

            const qrGuest = await prisma.qrGuest.findMany({
               select: { clientId: true },
               where: { id: guest.id },
            });

            const webhookData = {
               templateName: reminderTemplateName,
               blastingSource: 'QR_REMINDER',
               waId: whatsappResponse.messages?.map((data: any) => data.id)[0],
               status: whatsappResponse.messages?.map((data: any) => data.message_status)[0],
               recipientId: whatsappResponse.contacts?.map((data: any) => data.wa_id)[0],
               clientId: qrGuest[0]?.clientId,
               lastUpdateStatus: new Date(),
            };

            // Delete existing webhook if exists
            const webhookExist = await prisma.webhook.findMany({
               where: {
                  recipientId: webhookData.recipientId,
                  blastingSource: 'QR_REMINDER',
                  clientId: webhookData.clientId,
               },
            });

            if (webhookExist.length > 0) {
               await prisma.webhook.deleteMany({
                  where: {
                     id: { in: webhookExist.map((w) => w.id) },
                     blastingSource: 'QR_REMINDER',
                     clientId: webhookData.clientId,
                  },
               });
            }

            await prisma.webhook.create({ data: webhookData });

            logger.info('Reminder message sent successfully', {
               data: { guestId: guest.id, guestName: guest.name },
            });

            // Update broadcast log
            if (response.ok) {
               await updateBroadcastLog(guest.id, 'reminder_sent');
            } else {
               await updateBroadcastLog(guest.id, 'reminder_failed');
            }
         } catch (error) {
            logger.error('Failed to send reminder message', {
               data: { guestId: guest.id, guestName: guest.name, error },
            });
            await updateBroadcastLog(guest.id, 'reminder_failed');
         }
      }))
   );
};

// Helper function to send QR code messages
const sendQrCodeMessages = async (body: any, template: any, qrFile: any) => {
   await Promise.all(
      body.map(async (guest: any) => limit(async () => {
         try {
            const qrFileUrl = qrFile.filter((qr: any) => qr.code === guest.qr_code);
            const qrTemplateName = template.find((t: any) => t.type === 'qr_template')?.name;

            // Upload QR image to WhatsApp first
            try {
               const qrImageUrl = encodeImageUrl(process.env.NEXTAUTH_URL || '', qrFileUrl[0]?.path || '');
               logger.info('Attempting to upload QR image', { qrImageUrl, guestId: guest.id });
               const mediaId = await uploadMediaToWhatsApp(qrImageUrl);
               logger.info('✅ QR image uploaded successfully - FORCED MEDIA_ID MODE', { mediaId, guestId: guest.id });

               const whatsappBodyJsonQr = {
                  messaging_product: 'whatsapp',
                  to: `+${guest.phoneNumber}`,
                  type: 'template',
                  template: {
                     name: qrTemplateName,
                     language: { code: 'en' },
                     components: [
                        {
                           type: 'header',
                           parameters: [
                              {
                                 type: 'image',
                                 image: { id: mediaId },  // FORCED: Use media_id only
                              },
                           ],
                        },
                     ],
                  },
               };

               const myHeaders = new Headers();
               myHeaders.append('Content-Type', 'application/json');
               myHeaders.append('Authorization', `Bearer ${process.env.NEXT_WHATSAPP_TOKEN_ID}`);

               const response = await fetch(
                  `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
                  {
                     method: 'POST',
                     headers: myHeaders,
                     body: JSON.stringify(whatsappBodyJsonQr),
                  }
               );

               const whatsappQrResponse = await response.json();

               const qrGuest = await prisma.qrGuest.findMany({
                  select: { clientId: true },
                  where: { id: guest.id },
               });

               const webhookDataQr = {
                  templateName: qrTemplateName,
                  blastingSource: 'QR_CODE',
                  waId: whatsappQrResponse.messages?.map((data: any) => data.id)[0],
                  status: whatsappQrResponse.messages?.map((data: any) => data.message_status)[0],
                  recipientId: whatsappQrResponse.contacts?.map((data: any) => data.wa_id)[0],
                  clientId: qrGuest[0]?.clientId,
                  lastUpdateStatus: new Date(),
               };

               // Delete existing webhook if exists
               const webhookExistQr = await prisma.webhook.findMany({
                  where: {
                     recipientId: webhookDataQr.recipientId,
                     blastingSource: 'QR_CODE',
                     clientId: webhookDataQr.clientId,
                  },
               });

               if (webhookExistQr.length > 0) {
                  await prisma.webhook.deleteMany({
                     where: {
                        id: { in: webhookExistQr.map((w) => w.id) },
                        blastingSource: 'QR_CODE',
                        clientId: webhookDataQr.clientId,
                     },
                  });
               }

               await prisma.webhook.create({ data: webhookDataQr });

               logger.info('QR message sent successfully', {
                  data: { guestId: guest.id, guestName: guest.name },
               });

               // Update broadcast log
               if (response.ok) {
                  await updateBroadcastLog(guest.id, 'qr_sent');
               } else {
                  await updateBroadcastLog(guest.id, 'qr_failed');
               }
            } catch (uploadError: any) {
               logger.error('❌ FAILED to upload QR image - SKIPPING THIS GUEST', {
                  guestId: guest.id,
                  guestName: guest.name,
                  error: uploadError.message,
                  stack: uploadError.stack,
                  qrPath: qrFileUrl[0]?.path
               });
               await updateBroadcastLog(guest.id, 'qr_failed');
            }
         } catch (error) {
            logger.error('Failed to send QR message', {
               data: { guestId: guest.id, guestName: guest.name, error },
            });
            await updateBroadcastLog(guest.id, 'qr_failed');
         }
      }))
   );
};

// Helper function to update broadcast log
const updateBroadcastLog = async (guestId: number, status: string) => {
   const qrLogExist = await prisma.qrBroadcastLogs.findMany({
      where: { QrGuestId: guestId },
   });

   if (qrLogExist.length > 0) {
      await prisma.qrBroadcastLogs.updateMany({
         where: { QrGuestId: guestId },
         data: { status },
      });
   } else {
      await prisma.qrBroadcastLogs.create({
         data: { QrGuestId: guestId, status },
      });
   }
};
