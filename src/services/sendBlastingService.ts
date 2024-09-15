import logger from '@/libs/logger';
import prisma from '@/libs/prisma';
import { getSuccessReponse } from '@/utils/response/successResponse';
import { WhatsappBlastBody } from '@/utils/whatsappBlastBody';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

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
         // invitation/{clientCode}/{id}
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

      const invitationCreateData = await prisma.invitations.createMany({
         data: invitationsData,
      });

      const sendBlastingProcess = await Promise.all(
         data.map(async (d: any) => {
            const templateBody = await WhatsappBlastBody({
               data: d,
               broadcastTemplate: d.broadcastTemplate,
               image: clientImage,
               video: clientVideo,
               clientCode: clientCode,
            });

            logger.info('templateBodyLog', { data: templateBody });
            console.log('templateBody', templateBody);

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
            console.log(res);
            if (res.error) {
               return {
                  error: res.error,
                  guest: { id: d.id, name: d.name },
               };
            }
            return res;
         })
      );

      console.log('Response from whatsapp', sendBlastingProcess);

      logger.info('Response from whatsapp', sendBlastingProcess);

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

         return getSuccessReponse({ error: errorData }, 400, message[0]);
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
         return getSuccessReponse(invitationCreateData, 200, 'Successfully sent');
      }
   } catch (error) {
      console.log(error);
      return error;
   }
};

export const sendBlastingQrService = async (body: any, template: any, image: any, qrFile: any) => {
   return new Promise((resolve, reject) => {
      // Immediately resolve with 200 status and message
      resolve({ status: 200, message: 'Blasting process started' });

      const processBlasting = async () => {
         if (image?.length > 0) {
            // Send broadcast reminder with image
            await Promise.all(
               body.map(async (guest: any) => {
                  try {
                     const whatsappBodyJsonReminder = {
                        messaging_product: 'whatsapp',
                        to: `${guest.phoneNumber}`,
                        type: 'template',
                        template: {
                           name: template.find((t: any) => t.type === 'reminder_template')?.name,
                           language: { code: 'en' },
                           components: [
                              {
                                 type: 'header',
                                 parameters: [
                                    {
                                       type: 'image',
                                       image: {
                                          link: `${process.env.NEXTAUTH_URL}${image[0].path}`,
                                       },
                                    },
                                 ],
                              },
                              {
                                 type: 'body',
                                 parameters: [{ type: 'text', text: guest.name }],
                              },
                           ],
                        },
                     };

                     const qrFileUrl = qrFile.filter((qr: any) => qr.code === guest.qr_code);
                     const whatsappBodyJsonQr = {
                        messaging_product: 'whatsapp',
                        to: `${guest.phoneNumber}`,
                        type: 'template',
                        template: {
                           name: template.find((t: any) => t.type === 'qr_template')?.name,
                           language: { code: 'en' },
                           components: [
                              {
                                 type: 'header',
                                 parameters: [
                                    {
                                       type: 'image',
                                       image: {
                                          link: `${process.env.NEXTAUTH_URL}/${qrFileUrl[0].path}`,
                                       },
                                    },
                                 ],
                              },
                           ],
                        },
                     };

                     const myHeaders = new Headers();
                     myHeaders.append('Content-Type', 'application/json');
                     myHeaders.append('Authorization', `Bearer ${process.env.NEXT_WHATSAPP_TOKEN_ID}`);

                     // Send reminder message
                     const response = await fetch(
                        `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
                        {
                           method: 'POST',
                           headers: myHeaders,
                           body: JSON.stringify(whatsappBodyJsonReminder),
                        }
                     );

                     console.log('image', `${process.env.NEXTAUTH_URL}${image[0].path}`);
                     console.log('response reminder', response);

                     logger.info('Reminder message sent successfully', {
                        data: { guestId: guest.id, guestName: guest.name, response: response },
                     });

                     if (response.ok) {
                        // Wait for 10 seconds before sending the next message
                        await new Promise((resolve) => setTimeout(resolve, 10000));

                        // Send QR message
                        const responseQr = await fetch(
                           `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
                           {
                              method: 'POST',
                              headers: myHeaders,
                              body: JSON.stringify(whatsappBodyJsonQr),
                           }
                        );
                        console.log('qr image', `${process.env.NEXTAUTH_URL}/${qrFileUrl[0].path}`);
                        console.log('response qr', responseQr);

                        logger.info('QR message sent successfully', {
                           data: { guestId: guest.id, guestName: guest.name, response: responseQr },
                        });

                        if (responseQr.ok) {
                           await prisma.qrBroadcastLogs.create({
                              data: { QrGuestId: guest.id, status: 'success_sent' },
                           });
                           logger.info('QR broadcast log created successfully', {
                              data: { guestId: guest.id, guestName: guest.name },
                           });
                        } else {
                           await prisma.qrBroadcastLogs.create({
                              data: { QrGuestId: guest.id, status: 'failed_sent' },
                           });
                           logger.error('Failed to create QR broadcast log', {
                              data: { guestId: guest.id, guestName: guest.name },
                           });
                        }
                     } else {
                        await prisma.qrBroadcastLogs.create({
                           data: { QrGuestId: guest.id, status: 'failed_sent' },
                        });
                        logger.error('Failed to create QR broadcast log', {
                           data: { guestId: guest.id, guestName: guest.name },
                        });
                     }
                  } catch (error) {
                     logger.error('Failed to send broadcast message', {
                        data: { guestId: guest.id, guestName: guest.name, error: error },
                     });
                     await prisma.qrBroadcastLogs.create({
                        data: { QrGuestId: guest.id, status: 'failed_sent' },
                     });
                  }
               })
            );
         } else {
            // Send broadcast reminder without image
            await Promise.all(
               body.map(async (guest: any) => {
                  try {
                     const whatsappBodyJsonReminder = {
                        messaging_product: 'whatsapp',
                        to: `${guest.phoneNumber}`,
                        type: 'template',
                        template: {
                           name: template.find((t: any) => t.type === 'reminder_template')?.name,
                           language: { code: 'en' },
                           components: [
                              {
                                 type: 'body',
                                 parameters: [{ type: 'text', text: guest.name }],
                              },
                           ],
                        },
                     };

                     const qrFileUrl = qrFile.filter((qr: any) => qr.code === guest.qr_code);
                     const whatsappBodyJsonQr = {
                        messaging_product: 'whatsapp',
                        to: `${guest.phoneNumber}`,
                        type: 'template',
                        template: {
                           name: template.find((t: any) => t.type === 'qr_template')?.name,
                           language: { code: 'en' },
                           components: [
                              {
                                 type: 'header',
                                 parameters: [
                                    {
                                       type: 'image',
                                       image: {
                                          link: `${process.env.NEXTAUTH_URL}/${qrFileUrl[0].path}`,
                                       },
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
                           body: JSON.stringify(whatsappBodyJsonReminder),
                        }
                     );

                     logger.info('Reminder message sent successfully', {
                        data: { guestId: guest.id, guestName: guest.name, response: response },
                     });

                     if (response.ok) {
                        // Wait for 10 seconds before sending the next message
                        await new Promise((resolve) => setTimeout(resolve, 10000));

                        const responseQr = await fetch(
                           `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
                           {
                              method: 'POST',
                              headers: myHeaders,
                              body: JSON.stringify(whatsappBodyJsonQr),
                           }
                        );

                        console.log('qr image', `${process.env.NEXTAUTH_URL}/${qrFileUrl[0].path}`);
                        console.log('response qr', responseQr);

                        logger.info('QR message sent successfully', {
                           data: { guestId: guest.id, guestName: guest.name, response: responseQr },
                        });

                        if (responseQr.ok) {
                           await prisma.qrBroadcastLogs.create({
                              data: { QrGuestId: guest.id, status: 'success_sent' },
                           });
                           logger.info('QR broadcast log created successfully', {
                              data: { guestId: guest.id, guestName: guest.name },
                           });
                        } else {
                           await prisma.qrBroadcastLogs.create({
                              data: { QrGuestId: guest.id, status: 'failed_sent' },
                           });
                           logger.error('Failed to create QR broadcast log', {
                              data: { guestId: guest.id, guestName: guest.name },
                           });
                        }
                     } else {
                        await prisma.qrBroadcastLogs.create({
                           data: { QrGuestId: guest.id, status: 'failed_sent' },
                        });
                        logger.error('Failed to create QR broadcast log', {
                           data: { guestId: guest.id, guestName: guest.name },
                        });
                     }
                  } catch (error) {
                     logger.error('Failed to send broadcast message', {
                        data: { guestId: guest.id, guestName: guest.name, error: error },
                     });
                     await prisma.qrBroadcastLogs.create({
                        data: { QrGuestId: guest.id, status: 'failed_sent' },
                     });
                  }
               })
            );
         }
      };

      // Trigger the background process
      setTimeout(processBlasting, 0);
   });
};
