import { QrBroadcastTemplateTab } from '@/components/tab/QrBroadcastTemplateTab';
import prisma from '@/libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

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

      if (image?.length > 0) {
         // send broadcast reminder with image
         body?.map(async (guest: any) => {
            //    console.log('send broadcast reminder with image');
            const whatsappBodyJsonReminder = {
               messaging_product: 'whatsapp',
               to: guest.phoneNumber,
               type: 'template',
               template: {
                  name: template.filter((t: any) => t.type === 'reminder_template')[0].name,
                  language: {
                     code: 'en',
                  },
                  components: [
                     {
                        type: 'header',
                        parameters: [
                           {
                              type: 'image',
                              image: {
                                 // link: `${process.env.NEXTAUTH_URL}${image[0].path}`,
                                 link: 'https://images.unsplash.com/photo-1634729108541-516d16ddceec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                              },
                           },
                        ],
                     },
                     {
                        type: 'body',
                        parameters: [
                           {
                              type: 'text',
                              text: guest.name,
                           },
                        ],
                     },
                  ],
               },
            };

            // console.log('whatsappBodyJsonReminder', whatsappBodyJsonReminder);

            const qrFileUrl = qrFile.filter((qr: any) => qr.code === guest.qr_code);
            const whatsappBodyJsonQr = {
               messaging_product: 'whatsapp',
               to: guest.phoneNumber,
               type: 'template',
               template: {
                  name: template.filter((t: any) => t.type === 'qr_template')[0].name,
                  language: {
                     code: 'en',
                  },
                  components: [
                     {
                        type: 'header',
                        parameters: [
                           {
                              type: 'image',
                              image: {
                                 // link: `${process.env.NEXTAUTH_URL}/${qrFileUrl[0].path}`,
                                 link: 'https://images.unsplash.com/photo-1634729108541-516d16ddceec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
                  redirect: 'follow',
               }
            );
            const res = await response.json();
            console.log('res', res);

            if (response.ok) {
               // Wait for 10 seconds before proceeding
               await new Promise((resolve) => setTimeout(resolve, 10000));

               try {
                  // Send the WhatsApp message after the delay
                  const responseQr = await fetch(
                     `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
                     {
                        method: 'POST',
                        headers: myHeaders,
                        body: JSON.stringify(whatsappBodyJsonQr),
                        redirect: 'follow',
                     }
                  );

                  // Parse the response to JSON
                  const resQr = await responseQr.json();
                  console.log('resQr', resQr);

                  const createSuccessLogs = await prisma.qrBroadcastLogs.create({
                     data: {
                        QrGuestId: guest.id,
                        status: 'success_sent',
                     },
                  });

                  console.log('success logs', createSuccessLogs);

                  return NextResponse.json(
                     {
                        status: 200,
                        message: 'Broadcast reminder sent successfully',
                     },
                     { status: 200 }
                  );
               } catch (error) {
                  return NextResponse.json(
                     {
                        status: 500,
                        message: error,
                     },
                     { status: 500 }
                  );
               }
            }

            if (res.error) {
               const createErrorLogs = await prisma.qrBroadcastLogs.create({
                  data: {
                     QrGuestId: guest.id,
                     status: 'failed_sent',
                  },
               });

               return NextResponse.json(
                  {
                     status: 500,
                     message: res.error,
                  },
                  { status: 500 }
               );
            }
         });
      } else {
         // send broadcast reminder without image
         console.log('send broadcast reminder without image');
         body?.map(async (guest: any) => {
            const whatsappBodyJsonReminder = {
               messaging_product: 'whatsapp',
               to: guest.phoneNumber,
               type: 'template',
               template: {
                  name: template.filter((t: any) => t.type === 'reminder_template')[0].name,
                  language: {
                     code: 'en',
                  },
                  components: [
                     {
                        type: 'body',
                        parameters: [
                           {
                              type: 'text',
                              text: guest.name,
                           },
                        ],
                     },
                  ],
               },
            };

            const qrFileUrl = qrFile.filter((qr: any) => qr.code === guest.qr_code);
            const whatsappBodyJsonQr = {
               messaging_product: 'whatsapp',
               to: guest.phoneNumber,
               type: 'template',
               template: {
                  name: template.filter((t: any) => t.type === 'qr_template')[0].name,
                  language: {
                     code: 'en',
                  },
                  components: [
                     {
                        type: 'header',
                        parameters: [
                           {
                              type: 'image',
                              image: {
                                 // link: `${process.env.NEXTAUTH_URL}/${qrFileUrl[0].path}`,
                                 link: 'https://images.unsplash.com/photo-1634729108541-516d16ddceec?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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
                  redirect: 'follow',
               }
            );
            const res = await response.json();
            console.log('res', res);
            console.log('response', response);

            if (response.ok) {
               // Wait for 10 seconds before proceeding
               await new Promise((resolve) => setTimeout(resolve, 10000));

               try {
                  // Send the WhatsApp message after the delay
                  const responseQr = await fetch(
                     `https://graph.facebook.com/v20.0/${process.env.NEXT_PHONE_NUMBER_ID}/messages`,
                     {
                        method: 'POST',
                        headers: myHeaders,
                        body: JSON.stringify(whatsappBodyJsonQr),
                        redirect: 'follow',
                     }
                  );

                  // Parse the response to JSON
                  const resQr = await responseQr.json();
                  console.log('resQr', resQr);

                  const createSuccessLogs = await prisma.qrBroadcastLogs.create({
                     data: {
                        QrGuestId: guest.id,
                        status: 'success_sent',
                     },
                  });

                  console.log('success logs', createSuccessLogs);

                  return NextResponse.json(
                     {
                        status: 200,
                        message: 'Broadcast reminder sent successfully',
                     },
                     { status: 200 }
                  );
               } catch (error) {
                  return NextResponse.json(
                     {
                        status: 500,
                        message: error,
                     },
                     { status: 500 }
                  );
               }
            } else {
               const createErrorLogs = await prisma.qrBroadcastLogs.create({
                  data: {
                     QrGuestId: guest.id,
                     status: 'failed_sent',
                  },
               });

               return NextResponse.json(
                  {
                     status: response.status,
                     message: res.error,
                  },
                  { status: response.status }
               );
            }
         });
      }
      return NextResponse.json(
         {
            status: 200,
            message: 'Broadcast reminder sent successfully',
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

      return NextResponse.json(
         {
            status: 500,
            message: error,
         },
         { status: 500 }
      );
   }
}
