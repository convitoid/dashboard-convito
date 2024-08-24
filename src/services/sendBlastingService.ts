import prisma from '@/libs/prisma';
import { getSuccessReponse } from '@/utils/response/successResponse';
import { WhatsappBlastBody } from '@/utils/whatsappBlastBody';

export const sendBlastingService = async (data: any, clientId: any, clientCode: any) => {
   console.log(clientCode);
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

      data.map(async (d: any) => {
         d.broadcastTemplate.forEach(async (b: any, index: number) => {
            const templateBody = WhatsappBlastBody({
               data: d,
               broadcastTemplate: b[index].BroadcastTemplate,
               image: clientImage,
               video: clientVideo,
               clientCode: clientCode,
            });

            console.log(`templateBody`, templateBody);

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
            )
               .then((response) => response.json())
               .then((result) => {
                  console.log(result);
                  return result;
               })
               .catch((error) => {
                  console.log(error);
                  return error;
               });

            console.log(`response`, response);
         });
      });
      return getSuccessReponse({}, 200, 'Successfully sent');
   } catch (error) {
      return error;
   }
};
